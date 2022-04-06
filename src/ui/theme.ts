/**
 * js 文件下使用这个做类型提示
 * @type import('naive-ui').GlobalThemeOverrides
 */
import type { GlobalThemeOverrides } from 'naive-ui';

const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#57be6b',
    primaryColorHover: '#31c24a',
    borderRadius: '8px',
  },
  Button: {
    // textColor: '#000  ',
  },
  Layout: {
    siderColor: '#e5e5e5',
  },
};
const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#58bf6a',
    primaryColorHover: '#53b464',
    borderRadius: '8px',
  },
  Button: {
    // textColor: '#000',
  },
  Layout: {
    siderColor: '#2b2a2b',
  },
};

export { lightThemeOverrides, darkThemeOverrides };
