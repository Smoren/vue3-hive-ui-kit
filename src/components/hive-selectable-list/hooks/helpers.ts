import type { Ref } from "vue";
import type { ValueType } from "@hive/common/types";

export default function scrollIntoView(
  parent: Ref<null> | Ref<Record<string, any>>,
  dataValue: ValueType,
  scrollOptions = { block: "nearest" }
): undefined | void {
  const el = (parent.value as unknown as HTMLElement).querySelector(
    `[data-value="${dataValue}"]`
  );

  if (!el) {
    return;
  }

  (el as unknown as HTMLElement).scrollIntoView(
    scrollOptions as ScrollIntoViewOptions
  );
}
