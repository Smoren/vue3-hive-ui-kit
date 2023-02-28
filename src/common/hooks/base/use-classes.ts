import { computed, type ComputedRef, reactive, type Ref } from 'vue';

type BaseClassesType = string[] | Record<string, boolean>;
type ClassValueType = boolean | Ref<boolean> | ComputedRef<boolean>;

export type ExtraClassesType = Record<string, ClassValueType>;
export type ClassesType =
  | BaseClassesType
  | Ref<BaseClassesType>
  | ComputedRef<BaseClassesType>;

export interface ClassesConfig {
  classes: ClassesType | undefined;
  extraClasses: ExtraClassesType;
}

export type ClassesExport = ComputedRef<
  Array<unknown> | Record<string, unknown>
>;

export default function useClasses({
  classes,
  extraClasses,
}: ClassesConfig): ClassesExport {
  if (classes === undefined) {
    classes = {};
  }

  return computed(() => {
    if (classes instanceof Array) {
      return reactive([...classes, extraClasses]);
    }
    return reactive({ ...classes, ...extraClasses });
  });
}
