import { type Ref, ref } from "vue";

interface PickerExport {
  isPopupVisible: Ref<boolean>;
  togglePopupVisibility: () => void;
  hidePopup: (event?: Event) => void;
}

export default function useHivePicker(pickerId: string): PickerExport {
  const isPopupVisible = ref(false);

  const togglePopupVisibility = () => {
    isPopupVisible.value = !isPopupVisible.value;
  };

  const hidePopup = (event?: Event) => {
    if (
      event &&
      (event as FocusEvent).relatedTarget &&
      ((event as FocusEvent).relatedTarget as unknown as HTMLElement).closest(
        `#${pickerId}`
      )
    ) {
      return;
    }

    isPopupVisible.value = false;
  };

  return {
    isPopupVisible,
    togglePopupVisibility,
    hidePopup,
  };
}
