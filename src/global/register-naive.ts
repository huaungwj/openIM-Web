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
  ],
});
export function registerNaive(app: any) {
  app.use(naive);
}
