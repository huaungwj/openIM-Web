import { ref } from 'vue';
import type { InitConfig } from '@/tools/im/types';
import { IMURL } from '@/service/request/config';
import { im } from '@/tools';
import { useUserStore } from '@/stores/user';
import { useCveStore } from '@/stores/cve';
import { useContactsStore } from '@/stores/contacts';

export function useImLogin() {
  const userStore = useUserStore();
  const cveStore = useCveStore();
  const contactsStore = useContactsStore();

  const imLogin = async (userID: string, token: string) => {
    localStorage.setItem(`improfile`, token);
    localStorage.setItem(`curimuid`, userID);
    //pc
    localStorage.setItem(`lastimuid`, userID);
    const platformID = 5;

    const config: InitConfig = {
      userID,
      token,
      url: IMURL,
      platformID,
    };

    im.login(config)
      .then((res) => {
        // 1. 获取用户信息
        userStore.getSelfInfo();
        // 2. 获取会话列表
        cveStore.getCveList();
        // 3. 获取朋友列表
        contactsStore.getFriendList();
        // 4. 获取收到的好友申请列表
        contactsStore.getRecvFriendApplicationList();
        // 5. 获取发出的好友申请列表
        contactsStore.getSentFriendApplicationList();
        // 6. 获取群组列表
        contactsStore.getGroupList();
        // 7. 获取收到的入群申请
        contactsStore.getRecvGroupApplicationList();
        // 8. 获取发出的入群申请
        contactsStore.getSentGroupApplicationList();
        // 9. 获取未读数量
        contactsStore.getUnReadCount();
        // 10. 获取黑名单列表
        contactsStore.getBlackList();
        // 11. 获取 userToken
        userStore.getAdminToken(userID);
        // if (pageStatus.value === 'success') {
        //   navigate('/', { replace: true });
        // }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { imLogin };
}
