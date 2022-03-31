declare const _default: import('vue').DefineComponent<
  {
    tag: StringConstructor;
    contenteditable: {
      type: BooleanConstructor;
      default: boolean;
    };
    modelValue: StringConstructor;
    noHTML: {
      type: BooleanConstructor;
      default: boolean;
    };
    noNL: {
      type: BooleanConstructor;
      default: boolean;
    };
  },
  {
    update: (event: any) => void;
    onPaste: (event: any) => void;
    onKeypress: (event: any) => void;
    element: import('vue').Ref<HTMLElement | null>;
  },
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  {
    returned: StringConstructor;
    'update:modelValue': StringConstructor;
  },
  string,
  import('vue').VNodeProps &
    import('vue').AllowedComponentProps &
    import('vue').ComponentCustomProps,
  Readonly<
    {
      contenteditable: boolean;
      noHTML: boolean;
      noNL: boolean;
    } & {
      tag?: string | undefined;
      modelValue?: string | undefined;
    }
  >,
  {
    contenteditable: boolean;
    noHTML: boolean;
    noNL: boolean;
  }
>;
export default _default;
