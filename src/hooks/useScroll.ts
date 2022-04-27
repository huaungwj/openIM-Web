import { useCveStore } from '@/stores/cve';

export function useScroll() {
  const cveStore = useCveStore();
  const scrollTo = (type?: string, top?: number) => {
    if (type === '') return;
    if (type == 'bottom') {
      if (
        cveStore.cveContentRef.scrollHeight -
          cveStore.cveContentRef.clientHeight <=
        Math.floor(cveStore.cveContentRef.scrollTop)
      )
        return;
      cveStore.cveContentRef.scrollTo({
        top: cveStore.cveContentRef.scrollHeight,
        // behavior: 'smooth', // 动画
      });
    } else if (type === 'custom') {
      cveStore.cveContentRef.scrollTo({
        top,
        behavior: 'smooth',
      });
    }
  };

  return { scrollTo };
}
