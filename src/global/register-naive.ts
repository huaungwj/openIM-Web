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
  ],
});
export function registerNaive(app: any) {
  app.use(naive);
}
