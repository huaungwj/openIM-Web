import {
  create,
  NButton,
  NCard,
  NConfigProvider,
  NInput,
  NForm,
  NFormItem,
  NMessageProvider,
  NSelect,
  NCheckbox,
  NAvatar,
  NUpload,
  NSpin,
  NLayout,
  NLayoutSider,
  NLayoutContent,
  NTooltip,
  NScrollbar,
  NDropdown,
  NImage,
} from 'naive-ui';

const naive = create({
  components: [
    NButton,
    NCard,
    NConfigProvider,
    NInput,
    NForm,
    NFormItem,
    NMessageProvider,
    NSelect,
    NCheckbox,
    NAvatar,
    NUpload,
    NSpin,
    NLayout,
    NLayoutSider,
    NLayoutContent,
    NTooltip,
    NScrollbar,
    NDropdown,
    NImage,
  ],
});
export function registerNaive(app: any) {
  app.use(naive);
}
