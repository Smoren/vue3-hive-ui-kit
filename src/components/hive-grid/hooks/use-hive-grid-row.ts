import type { EventData } from "../../common/hooks/base/use-event-handler";

interface HelperFunctionConfig {
  event: EventData;
  handleChange: (value: EventData["value"], view?: unknown) => void;
  handleToggle: () => void;
}

export default function useHiveGridRow() {
  const dropDownChangeHelper = ({
    event,
    handleChange,
    handleToggle,
  }: HelperFunctionConfig) => {
    if (event.type === "focusout") {
      handleChange(event.value);
      handleToggle();
    }
  };

  const dateChangeHelper = ({
    event,
    handleChange,
    handleToggle,
  }: HelperFunctionConfig) => {
    if (event.type === "valueChange") {
      handleChange(event.value, event.component.formattedDate);
      handleToggle();
    }
  };

  const dateRangeChangeHelper = ({
    event,
    handleChange,
    handleToggle,
  }: HelperFunctionConfig) => {
    if (event.type === "valueChange") {
      handleChange(event.value, event.component.formattedDates);
      handleToggle();
    }
  };

  const dateTimeRangeChangeHelper = ({
    event,
    handleChange,
    handleToggle,
  }: HelperFunctionConfig) => {
    if (event.type === "valueChange") {
      handleChange(
        event.component.currentValue,
        event.component.formattedDateTimeRange
      );
      handleToggle();
    }
  };

  const timeRangeChangeHelper = ({
    event,
    handleChange,
    handleToggle,
  }: HelperFunctionConfig) => {
    if (event.type === "valueChange") {
      handleChange(event.value, event.component.formattedTime);
      handleToggle();
    }
  };

  const timeChangeHelper = ({
    event,
    handleChange,
    handleToggle,
  }: HelperFunctionConfig) => {
    if (event.type === "valueChange") {
      handleChange(event.value, event.component.formattedTime);
      handleToggle();
    }
  };

  const autocompleteChangeHelper = ({
    event,
    handleChange,
    handleToggle,
  }: HelperFunctionConfig) => {
    if (event.type === "valueChange") {
      handleChange(event.value);
    }
  };

  const multiselectChangeHelper = ({
    event,
    handleChange,
    handleToggle,
  }: HelperFunctionConfig) => {
    if (event.type === "focusout") {
      handleChange(event.value);
      handleToggle();
    }
  };

  return {
    dropDownChangeHelper,
    dateChangeHelper,
    dateRangeChangeHelper,
    dateTimeRangeChangeHelper,
    timeChangeHelper,
    timeRangeChangeHelper,
    autocompleteChangeHelper,
    multiselectChangeHelper,
  };
}
