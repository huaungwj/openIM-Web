// @ts-nocheck
import COS from 'cos-js-sdk-v5';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import type { responseType } from '@/service/response/common';
import { adminRequest } from '@/service/';

export const getCosAuthorization = async () => {
  // const url = `${ADMINURL}/third/tencent_cloud_storage_credential`;

  const res: responseType = await adminRequest.instance({
    method: 'POST',
    url: '/third/tencent_cloud_storage_credential',
    data: JSON.stringify({ operationID: Date.now().toString() }),
    headers: {
      token: localStorage.getItem(`improfile`),
      'Content-Type': 'application/json',
    },
  });

  if (res.errCode === 0)
    localStorage.setItem(`cosprofile`, JSON.stringify(res.data));
};

export const cos = new COS({
  getAuthorization: function (options, callback) {
    let cosprofile = localStorage.getItem('cosprofile');
    if (!cosprofile) return;
    cosprofile = JSON.parse(cosprofile);
    const result = cosprofile.CredentialResult;

    callback({
      TmpSecretId: result.Credentials?.TmpSecretID,
      TmpSecretKey: result.Credentials?.TmpSecretKey,
      SecurityToken: result.Credentials?.SessionToken,
      StartTime: result.StartTime,
      ExpiredTime: result.ExpiredTime,
    });
  },
});

export const cosUploadNomal = (
  file: File,
  pcb?: COS.onProgress
): Promise<COS.PutObjectResult & { url: string }> => {
  const dpcb = () => {};
  return new Promise((resolve, reject) => {
    let cosprofile = localStorage.getItem('cosprofile');
    if (!cosprofile) reject('no cosprofile');
    cosprofile = JSON.parse(cosprofile);

    cos.putObject(
      {
        Bucket: cosprofile.Bucket /* 必须 */,
        Region: cosprofile.Region /* 存储桶所在地域，必须字段 */,
        Key: 'IMG' + file.lastModified + file.name /* 必须 */,
        // StorageClass: 'STANDARD',
        Body: file, // 上传文件对象
        onProgress: pcb ?? dpcb,
      },
      function (cerr, cdata) {
        if (cerr) {
          reject(cerr);
        } else {
          cdata.url = 'https://' + cdata.Location;
          resolve(cdata);
        }
      }
    );
  });
};

export const cosUpload = (
  data: UploadRequestOption,
  pcb?: COS.onProgress
): Promise<COS.PutObjectResult & { url: string }> => {
  const dpcb = () => {};
  return new Promise((resolve, reject) => {
    let cosprofile = localStorage.getItem('cosprofile');
    if (!cosprofile) reject('no cosprofile');
    cosprofile = JSON.parse(cosprofile);

    console.log(data);

    cos.putObject(
      {
        Bucket: cosprofile.Bucket /* 必须 */,
        Region: cosprofile.Region /* 存储桶所在地域，必须字段 */,
        //@ts-ignore
        Key: data.id + data.name /* 必须 */,
        // StorageClass: 'STANDARD',
        Body: data.file, // 上传文件对象
        onProgress: pcb ?? dpcb,
      },
      function (cerr, cdata) {
        if (cerr) {
          reject(cerr);
        } else {
          cdata.url = 'https://' + cdata.Location;
          resolve(cdata);
        }
      }
    );
  });
};

export const thumUpload = (
  file: File
): Promise<COS.PutObjectResult & { url: string }> => {
  return new Promise((resolve, reject) => {
    let cosprofile = localStorage.getItem('cosprofile');
    if (!cosprofile) reject('no cosprofile');
    cosprofile = JSON.parse(cosprofile);

    cos.putObject(
      {
        Bucket: cosprofile.Bucket /* 必须 */,
        Region: cosprofile.Region /* 存储桶所在地域，必须字段 */,
        Key: file.name /* 必须 */,
        // StorageClass: 'STANDARD',
        Body: file, // 上传文件对象
        onProgress: () => {},
      },
      function (cerr, cdata) {
        if (cerr) {
          reject(cerr);
        } else {
          cdata.url = 'https://' + cdata.Location;
          resolve(cdata);
        }
      }
    );
  });
};
