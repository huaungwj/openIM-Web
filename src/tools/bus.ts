import { ref } from 'vue';
import type { Ref } from 'vue';

type eventItem = {
  key: (data: any) => void[];
};

class Bus {
  constructor() {
    // 收集订阅信息,调度中心
    (this.eventList = []), // 事件列表，这项是必须的
      // 下面的都是自定义值
      (this.msg = ref('这是一条总线的信息'));
  }

  public eventList: eventItem[];
  public msg: Ref<string>;

  // 订阅
  $on(name: string, fn: (data: any) => void) {
    this.eventList[name] = this.eventList[name] || [];
    this.eventList[name].push(fn);
  }

  // 发布
  $emit(name: string, data: any) {
    if (this.eventList[name]) {
      this.eventList[name].forEach((fn) => {
        fn(data);
      });
    }
  }

  // 取消订阅
  $off(name: string) {
    if (this.eventList[name]) {
      delete this.eventList[name];
    }
  }
}

export default new Bus();
