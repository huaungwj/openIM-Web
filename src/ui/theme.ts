/**
 * js 文件下使用这个做类型提示
 * @type import('naive-ui').GlobalThemeOverrides
 */
import type { GlobalThemeOverrides } from 'naive-ui';
const themeOverrides: GlobalThemeOverrides = {
  common: {
    // primaryColorHover: '#4098FC',
    // primaryColorPressed: '#1060C9',
    // primaryColorSuppl: '#4098FC',
  },
  // Button: {
  //     textColor: '#FF0000'
  // }
};

const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#57be6b',
    primaryColorHover: '#31c24a',
  },
  Button: {
    // textColor: '#000  ',
  },
};
const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#58bf6a',
    primaryColorHover: '#53b464',
  },
  Button: {
    // textColor: '#000',
  },
};

export { lightThemeOverrides, darkThemeOverrides };
