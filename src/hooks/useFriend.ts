import { ref, watch } from 'vue';
import { useContactsStore } from '@/stores/contacts';
import type { FriendItem } from '@/tools/im/types';
import { pySegSort } from '@/tools/tools';

type Cons = {
  data: FriendItem[];
  initial: string;
};
// use
export function useFriend() {
  const sections = ref<string[]>(); // 锚点
  const consList = ref<Cons[]>(); // 数据
  const regionActive = ref<string>('A');
  const contactsStore = useContactsStore();

  // 朋友列表
  const initFriendList = () => {
    if (contactsStore.friendList.length > 0) {
      const sortData: Cons[] = pySegSort(
        contactsStore.friendList,
        'nickname'
      ).segs;
      // console.log(sortData);
      sections.value = sortData.map((sec) => sec.initial);
      // setCons(sortData);
      consList.value = sortData;
      regionActive.value = sortData[0].initial;
    }
  };
  watch(
    () => contactsStore.friendList,
    () => {
      initFriendList();
    }
  );

  return {
    sections,
    consList,
    regionActive,
    initFriendList,
  };
}
