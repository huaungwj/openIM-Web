import { getCosAuthorization, cosUpload } from '@/tools/cos';
import type { UploadRequestOption, RcFile } from 'rc-upload/lib/interface';
import { useMessage } from 'naive-ui';
import { getPicInfo, getVideoInfo } from '@/tools/tools';
import { im } from '@/tools';
import {
  messageTypes,
  notOssMessageTypes,
} from '@/tools/im/constants/messageContentType';
import type { WsResponse } from '@/tools/im/types';
import { uuid } from '@/tools/im';
import { useCveStore } from '@/stores/cve';

type NMsgMap = {
  oid: string;
  mid: string;
  flag: boolean;
};

// use
const cveStore = useCveStore();

let nMsgMaps: NMsgMap[] = [];

const message = useMessage();
export const useUploadFile = () => {
  // 上传 oss
  const sendCosMsg = async (uploadData: UploadRequestOption, type: string) => {
    console.log(type, uploadData);
    await getCosAuthorization();
    cosUpload(uploadData)
      .then((res) => {
        switch (type) {
          case 'image':
            imgMsg(uploadData as any, res.url);
            break;
          case 'video':
            videoMsg(uploadData as any, res.url);
            break;
          case 'file':
            fileMsg(uploadData as any, res.url);
            break;
          default:
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  // 图片消息
  const imgMsg = async (file: RcFile, url: string) => {
    console.log(file);
    const { width, height } = await getPicInfo(file);
    const sourcePicture = {
      uuid: file.uid,
      type: file.type,
      size: file.size,
      width,
      height,
      url,
    };
    const snapshotPicture = {
      uuid: file.uid,
      type: file.type,
      size: file.size,
      width: 200,
      height: 200,
      url: url + '?imageView2/1/w/200/h/200/rq/80',
    };
    const imgInfo = {
      sourcePicture,
      snapshotPicture,
      bigPicture: sourcePicture,
    };
    const { data } = await im.createImageMessage(imgInfo);
    sendMsg(data, messageTypes.PICTUREMESSAGE);
  };

  // 视频消息
  const videoMsg = async (file: RcFile, url: string) => {
    // 找不到视频默认显示
    const snp =
      'https://echat-1302656840.cos.ap-chengdu.myqcloud.com/rc-upload-1638518718431-15video_cover.png?imageView2/1/w/200/h/200/rq/80';
    const duration = await getVideoInfo(file);
    const videoInfo = {
      videoPath: url,
      duration,
      videoType: file.type,
      snapshotPath: snp,
      videoUUID: file.uid,
      videoUrl: url,
      videoSize: file.size,
      snapshotUUID: file.uid,
      snapshotSize: 117882,
      snapshotUrl: snp,
      snapshotWidth: 1024,
      snapshotHeight: 1024,
    };
    const { data } = await im.createVideoMessage(videoInfo);
    sendMsg(data, messageTypes.VIDEOMESSAGE);
  };
  // 文件其他类型
  const fileMsg = async (file: RcFile, url: string) => {
    const fileInfo = {
      filePath: url,
      fileName: file.name,
      uuid: file.uid,
      sourceUrl: url,
      fileSize: file.size,
    };
    const { data } = await im.createFileMessage(fileInfo);
    sendMsg(data, messageTypes.FILEMESSAGE);
  };

  const sendMsg = async (
    nMsg: string,
    type: messageTypes,
    uid?: string,
    gid?: string
  ) => {
    const operationID = uuid();
    if (
      (uid && cveStore.curCve?.userID === uid) ||
      (gid && cveStore.curCve?.groupID === gid) ||
      (!uid && !gid)
    ) {
      const parsedMsg = JSON.parse(nMsg);
      const tMsgMap = {
        oid: operationID,
        mid: parsedMsg.clientMsgID,
        flag: false,
      };
      console.log(parsedMsg);
      nMsgMaps = [...nMsgMaps, tMsgMap]; // 保存发送过的信息
      parsedMsg.status = 2;
      cveStore.setHistoryMsgList([parsedMsg, ...cveStore.historyMsgList]); // 更新historyMsg
      setTimeout(() => {
        const item = nMsgMaps.find((n) => n.mid === parsedMsg.clientMsgID);
        if (item && !item.flag) {
          cveStore.historyMsgList.find((h) => {
            if (h.clientMsgID === item.mid) {
              h.status = 1;
            }
          });
        }
      }, 2000);
      // nextTick(() => {
      //   scrollTo();
      // });
    }
    const offlinePushInfo = {
      title: '你有一条新消息',
      desc: '',
      ex: '',
      iOSPushSound: '+1',
      iOSBadgeCount: true,
    };
    const sendOption = {
      recvID: uid ?? cveStore.curCve.userID,
      groupID: gid ?? cveStore.curCve.groupID,
      offlinePushInfo,
      message: nMsg,
    };
    nMsgMaps = nMsgMaps.filter((f) => !f.flag);
    if (notOssMessageTypes.includes(type)) {
      im.sendMessageNotOss(sendOption, operationID)
        .then((res) => sendMsgCB(res, type))
        .catch((err) => sendMsgCB(err, type, true));
    } else {
      im.sendMessage(sendOption, operationID)
        .then((res) => sendMsgCB(res, type))
        .catch((err) => sendMsgCB(err, type, true));
    }
  };

  const sendMsgCB = (res: WsResponse, type: messageTypes, err?: boolean) => {
    nMsgMaps.map((tn) => {
      if (tn.oid === res.operationID) {
        const idx = cveStore.historyMsgList.findIndex(
          (his) => his.clientMsgID === tn?.mid
        );
        if (idx !== -1) {
          tn.flag = true;
          err
            ? (cveStore.historyMsgList[idx].status = 3)
            : (cveStore.historyMsgList[idx] = JSON.parse(res.data));
        }
      }
    });
    if (type === messageTypes.MERGERMESSAGE) message.success('发送成功');
  };

  return { sendCosMsg, sendMsg };
};
