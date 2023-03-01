<template>
  <tr
    class="row"
    v-for="(item, index) in arrayOfSplittedItems.length === 0
      ? items
      : arrayOfSplittedItems[currentPage - 1]"
    :key="(item as any).id"
    :class="[index % 2 === 0 ? 'even' : 'odd']"
  >
    <hive-grid-ceil :editable="false">
      <!-- <template #view>
        <div class="gap">
          <HiveButton text="AddUp" @click="addRow(true, getRowIndex(index))">
            <template #after>
              <span class="delete-icon"> + </span>
            </template>
          </HiveButton>
          <HiveButton text="Delete" @click="deleteRow(getRowIndex(index))">
            <template #after>
              <span class="delete-icon"> &times; </span>
            </template>
          </HiveButton>
          <HiveButton text="AddDown" @click="addRow(false, getRowIndex(index))">
            <template #after>
              <span class="delete-icon"> + </span>
            </template>
          </HiveButton>
        </div>
      </template> -->
    </hive-grid-ceil>
    <hive-grid-ceil
      v-for="element in columns"
      :key="element.field"
      :text="(item[element.field] as any)?.text ?? item[element.field]"
      :object="item"
      :field="element.field"
      :editable="element.editable"
      :valueType="element.viewType === 'list' ? 'array' : 'string'"
      @event="(event) => $emit('event', event)"
    >
      <template
        #edit="{ value, update, isChangeAllowed, toggle, customChange }"
      >
        <slot
          :name="element.field + '-edit'"
          :value="value"
          :update="update"
          :is-change-allowed="isChangeAllowed"
          :toggle="toggle"
          :customChange="customChange"
        >
          <HiveInputNumber
            v-if="element.editType === 'number'"
            @click.stop
            :model-value="value"
            @input="update"
            :is-invalid="!isChangeAllowed"
          />
          <HiveInputDate
            v-else-if="element.editType === 'date'"
            @click.stop
            :model-value="value"
            @event="
              (event) =>
                dateChangeHelper({
                  event,
                  handleChange: customChange,
                  handleToggle: toggle,
                })
            "
            :is-invalid="!isChangeAllowed"
          />
          <HiveInputDateRange
            v-else-if="element.editType === 'date-range'"
            @click.stop
            :model-value="value"
            @event="
              (event) =>
                dateRangeChangeHelper({
                  event,
                  handleChange: customChange,
                  handleToggle: toggle,
                })
            "
            :is-invalid="!isChangeAllowed"
          />
          <HiveInputDateTimeRange
            v-else-if="element.editType === 'date-time-range'"
            :model-value="value"
            @event="
              (event) =>
                dateTimeRangeChangeHelper({
                  event,
                  handleChange: customChange,
                  handleToggle: toggle,
                })
            "
            :is-invalid="!isChangeAllowed"
          />
          <HiveInputTime
            v-else-if="element.editType === 'time'"
            :model-value="value"
            @event="
              (event) =>
                timeChangeHelper({
                  event,
                  handleChange: customChange,
                  handleToggle: toggle,
                })
            "
            :is-invalid="!isChangeAllowed"
          />
          <HiveInputTimeRange
            v-else-if="element.editType === 'time-range'"
            :model-value="value"
            @event="
              (event) =>
                timeRangeChangeHelper({
                  event,
                  handleChange: customChange,
                  handleToggle: toggle,
                })
            "
            :is-invalid="!isChangeAllowed"
          />
          <HiveDropDownList
            v-else-if="element.editType === 'dropdown-list'"
            :model-value="value"
            :options="element.options"
            :is-invalid="!isChangeAllowed"
            @event="
              (event) =>
                dropDownChangeHelper({
                  event,
                  handleChange: customChange,
                  handleToggle: toggle,
                })
            "
          />
          <HiveTextarea
            v-else-if="element.editType === 'textarea'"
            :model-value="value"
            :options="element.options"
            :is-invalid="!isChangeAllowed"
            @input="update"
          />
          <HiveAutocomplete
            v-else-if="element.editType === 'autocomplete'"
            :model-value="value"
            :options="element.options"
            :is-invalid="!isChangeAllowed"
            @event="
              (event) =>
                autocompleteChangeHelper({
                  event,
                  handleChange: customChange,
                  handleToggle: toggle,
                })
            "
          />
          <hive-multiselect
            v-else-if="element.editType === 'multiselect'"
            :model-value="value"
            @event="
              (event) =>
                multiselectChangeHelper({
                  event,
                  handleChange: customChange,
                  handleToggle: toggle,
                })
            "
            :options="element.options"
          />
          <HiveInputTextVue
            v-else
            @click.stop
            :model-value="element.viewType === 'list' ? value.join(',') : value"
            @input="update"
            :is-invalid="!isChangeAllowed"
          />
        </slot>
      </template>
      <template #view="{ value, view }">
        <slot :name="element.field" :item="item[element.field]">
          <template v-if="element.viewType === 'list'">
            <div v-if="!element.separator">
              <div v-for="e in value">
                {{ e }}
              </div>
            </div>
            <div v-else>
              {{
                value !== null && Array.isArray(value)
                  ? value.join(element.separator)
                  : value
              }}
            </div>
          </template>
          <div v-else>
            {{ view ? view : value }}
          </div>
        </slot>
      </template>
    </hive-grid-ceil>
  </tr>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import HiveGridCeil from "@hive/components/hive-grid/HiveGridCeil.vue";
import HiveInputTextVue from "../hive-input-text/HiveInputText.vue";
import HiveInputNumber from "../hive-input-number/HiveInputNumber.vue";
import HiveInputDate from "../hive-input-date/HiveInputDate.vue";
import HiveInputDateRange from "../hive-input-date-range/HiveInputDateRange.vue";
import HiveDropDownList from "../hive-drop-down-list/HiveDropDownList.vue";
import HiveInputDateTimeRange from "../hive-input-datetime-range/HiveInputDateTimeRange.vue";
import HiveInputTime from "../hive-input-time/HiveInputTime.vue";
import HiveInputTimeRange from "../hive-input-time-range/HiveInputTimeRange.vue";
import HiveTextarea from "../hive-textarea/HiveTextarea.vue";
import HiveAutocomplete from "../hive-autocomplete/HiveAutocomplete.vue";
import HiveMultiselect from "../hive-multiselect/HiveMultiselect.vue";
import HiveButton from "../hive-button/HiveButton.vue";
import useOnMount from "@hive/common/hooks/base/use-on-mount";
import useComponent from "../common/hooks/base/use-component";
import useHiveGridRow from "./hooks/use-hive-grid-row";
import type { GridColumns } from "./hooks/use-hive-grid";
import { employees, columns as clmns, columns } from "./mooks";
import useEventHandler, {
  type EventConfig,
} from "@hive/common/hooks/base/use-event-handler";

export default defineComponent({
  name: "HiveGridRow",
  components: {
    HiveGridCeil,
    HiveInputTextVue,
    HiveInputNumber,
    HiveInputDate,
    HiveDropDownList,
    HiveInputDateRange,
    HiveInputDateTimeRange,
    HiveInputTime,
    HiveInputTimeRange,
    HiveTextarea,
    HiveAutocomplete,
    HiveMultiselect,
    HiveButton,
  },
  props: {
    arrayOfSplittedItems: {
      type: Array,
      default: [],
    },
    items: {
      type: Array,
      default: [],
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    columns: {
      type: Array as PropType<GridColumns[]>,
      default: clmns,
    },
  },
  mounted() {
    useOnMount(this);
  },
  setup(props, context) {
    const { component } = useComponent(props);

    const handleEvent = useEventHandler({
      props,
      context,
      component,
    } as EventConfig);

    const {
      dropDownChangeHelper,
      dateChangeHelper,
      dateRangeChangeHelper,
      dateTimeRangeChangeHelper,
      timeChangeHelper,
      timeRangeChangeHelper,
      autocompleteChangeHelper,
      multiselectChangeHelper,
    } = useHiveGridRow();

    return {
      component,
      dropDownChangeHelper,
      dateChangeHelper,
      dateRangeChangeHelper,
      dateTimeRangeChangeHelper,
      timeChangeHelper,
      timeRangeChangeHelper,
      autocompleteChangeHelper,
      multiselectChangeHelper,
      handleEvent,
    };
  },
});
</script>

<style></style>
