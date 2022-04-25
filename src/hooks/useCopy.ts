import { useMessage } from 'naive-ui';

export function useCopy() {
  const message = useMessage();
  const copyFun = (value: string) => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', value);

    console.log(input);
    if (document.execCommand('copy')) {
      input.select();
      document.execCommand('copy');
      message.success('复制成功！');
    } else {
      message.error('复制失败，浏览器暂不支持！');
    }
    document.body.removeChild(input);
  };

  return { copyFun };
}
