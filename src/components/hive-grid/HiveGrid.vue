<template>
  <div class="wrapper">
    <table class="hive-grid">
      <hive-grid-header :columns="columns" @sort="sort" @event="logEvent" />
      <tbody>
        <tr
          class="row"
          v-for="(item, index) in arrayOfSplittedItems.length === 0
            ? items
            : arrayOfSplittedItems[currentPage - 1]"
          :key="(item as any).id"
          :class="[index % 2 === 0 ? 'even' : 'odd']"
        >
          <hive-grid-ceil :editable="false">
            <template #view>
              <div class="gap">
                <HiveButton
                  text="AddUp"
                  @click="addRow(true, getRowIndex(index))"
                >
                  <template #after>
                    <span class="delete-icon"> + </span>
                  </template>
                </HiveButton>
                <HiveButton
                  text="Delete"
                  @click="deleteRow(getRowIndex(index))"
                >
                  <template #after>
                    <span class="delete-icon"> &times; </span>
                  </template>
                </HiveButton>
                <HiveButton
                  text="AddDown"
                  @click="addRow(false, getRowIndex(index))"
                >
                  <template #after>
                    <span class="delete-icon"> + </span>
                  </template>
                </HiveButton>
              </div>
            </template>
          </hive-grid-ceil>
          <hive-grid-ceil
            v-for="element in columns"
            :key="element.field"
            :text="(item as any)[element.field]?.text ?? (item as any)[element.field]"
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
                  :model-value="
                    element.viewType === 'list' ? value.join(',') : value
                  "
                  @input="update"
                  :is-invalid="!isChangeAllowed"
                />
              </slot>
            </template>
            <template #view="{ value, view }">
              <slot :name="element.field" :item="(item as any)[element.field]">
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
      </tbody>
    </table>
    <div v-if="arrayOfSplittedItems.length !== 0" class="pagination-item">
      <svg
        @click="prevPage(1)"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="30px"
        height="30px"
        viewBox="0 0 30 30"
        version="1.1"
        class="pagination-item_svg"
        :class="{ disabled: currentPage === 1 }"
      >
        <g id="surface1">
          <path
            style="stroke: none; fill-rule: nonzero; fill-opacity: 1"
            d="M 14.15625 22.46875 L 6.65625 14.96875 L 14.15625 7.46875 L 15.46875 8.78125 L 9.28125 14.96875 L 15.46875 21.15625 Z M 22.0625 22.46875 L 14.5625 14.96875 L 22.0625 7.46875 L 23.375 8.78125 L 17.1875 14.96875 L 23.375 21.15625 Z M 22.0625 22.46875 "
          />
        </g>
      </svg>
      <svg
        @click="prevPage()"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="30px"
        height="30px"
        viewBox="0 0 30 30"
        version="1.1"
        class="pagination-item_svg"
        :class="{ disabled: currentPage === 1 }"
      >
        <g id="surface1">
          <path
            style="stroke: none; fill-rule: nonzero; fill-opacity: 1"
            d="M 17.53125 22.5 L 10 14.96875 L 17.53125 7.4375 L 18.875 8.78125 L 12.6875 14.96875 L 18.875 21.15625 Z M 17.53125 22.5 "
          />
        </g>
      </svg>
      <span class="pagination_navigation-current">{{ currentPage }} </span>
      <svg
        @click="nextPage()"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="30px"
        height="30px"
        viewBox="0 0 30 30"
        version="1.1"
        class="pagination-item_svg"
        :class="{ disabled: currentPage === arrayOfSplittedItems.length }"
      >
        <g id="surface1">
          <path
            style="stroke: none; fill-rule: nonzero; fill-opacity: 1"
            d="M 11.71875 22.5 L 10.375 21.15625 L 16.5625 14.96875 L 10.375 8.78125 L 11.71875 7.4375 L 19.25 14.96875 Z M 11.71875 22.5 "
          />
        </g>
      </svg>
      <svg
        @click="nextPage(arrayOfSplittedItems.length)"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="30px"
        height="30px"
        viewBox="0 0 30 30"
        version="1.1"
        class="pagination-item_svg"
        :class="{ disabled: currentPage === arrayOfSplittedItems.length }"
      >
        <g id="surface1">
          <path
            style="stroke: none; fill-rule: nonzero; fill-opacity: 1"
            d="M 7.96875 22.46875 L 6.65625 21.15625 L 12.84375 14.96875 L 6.65625 8.78125 L 7.96875 7.46875 L 15.46875 14.96875 Z M 15.875 22.46875 L 14.5625 21.15625 L 20.75 14.96875 L 14.5625 8.78125 L 15.875 7.46875 L 23.375 14.96875 Z M 15.875 22.46875 "
          />
        </g>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  type PropType,
  type Ref,
  ref,
  watch,
  type WritableComputedRef,
} from "vue";
import useHiveGrid, {
  type GridColumns,
  type GridConfig,
} from "@hive/components/hive-grid/hooks/use-hive-grid";
import commonProps from "@hive/common/mixins/common-props";
import useComponent from "@hive/common/hooks/base/use-component";
import useEventHandler, {
  type EventConfig,
  type EventData,
} from "@hive/common/hooks/base/use-event-handler";
import useOnMount from "@hive/common/hooks/base/use-on-mount";
import HiveGridHeader from "@hive/components/hive-grid/HiveGridHeader.vue";
import HiveGridCeil from "@hive/components/hive-grid/HiveGridCeil.vue";
import { employees, columns as clmns, columns } from "./mooks";
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
import HiveLoader from "../hive-loader/HiveLoader.vue";

export default defineComponent({
  name: "HiveGrid",
  components: {
    HiveGridHeader,
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
    HiveLoader,
  },
  props: {
    dataItems: {
      type: Array,
      default: () => employees,
    },
    columns: {
      type: Array as PropType<GridColumns[]>,
      default: clmns,
    },
    dontShowList: {},
    itemsOnPage: {
      default: 0,
      type: Number,
    },
    ...commonProps,
  },
  mounted() {
    useOnMount(this);
  },
  setup(props, context) {
    const { component } = useComponent(props);

    const loaded = ref(false);

    const {
      items,
      sort,
      dropDownChangeHelper,
      dateChangeHelper,
      dateRangeChangeHelper,
      dateTimeRangeChangeHelper,
      timeChangeHelper,
      timeRangeChangeHelper,
      autocompleteChangeHelper,
      multiselectChangeHelper,
      deleteRow,
      itemsLength,
      addRow,
      isLoading,
    } = useHiveGrid({
      columns: props.columns,
      dataItems: props.dataItems,
    } as GridConfig);

    const handleEvent = useEventHandler({
      props,
      context,
      component,
      modelValue: items,
    } as EventConfig);

    const arrayOfSplittedItems: Ref<Record<string, any>[][]> = ref([]);
    const currentPage = ref(1);

    const prevPage = (page?: number) => {
      if (currentPage.value === 1) return;
      page === undefined ? currentPage.value-- : (currentPage.value = page);
    };

    const nextPage = (page?: number) => {
      if (currentPage.value === arrayOfSplittedItems.value.length) return;
      page === undefined ? currentPage.value++ : (currentPage.value = page);
    };

    const pagination = (items: WritableComputedRef<object[]>) => {
      arrayOfSplittedItems.value.length = 0;
      if (props.itemsOnPage === 0) return;
      for (let i = 0; i < items.value.length / props.itemsOnPage; i++) {
        arrayOfSplittedItems.value.push(
          items.value.slice(
            i * props.itemsOnPage,
            i * props.itemsOnPage + props.itemsOnPage
          )
        );
      }
    };

    const getRowIndex = (index: number) => {
      return (currentPage.value - 1) * props.itemsOnPage + index;
    };

    onMounted(() => {
      pagination(items);
    });

    watch(itemsLength, () => {
      pagination(items);
    });

    const logEvent = (event: EventData) => {
      if (event.type === "addTop") {
        addRow(true, 0);
      } else if (event.type === "addBottom") {
        addRow(false, itemsLength.value - 1);
      }
    };

    return {
      component,
      handleEvent,
      items,
      sort,
      dropDownChangeHelper,
      logEvent,
      dateChangeHelper,
      dateRangeChangeHelper,
      dateTimeRangeChangeHelper,
      timeChangeHelper,
      timeRangeChangeHelper,
      autocompleteChangeHelper,
      multiselectChangeHelper,
      arrayOfSplittedItems,
      currentPage,
      prevPage,
      nextPage,
      deleteRow,
      getRowIndex,
      itemsLength,
      addRow,
      isLoading,
      loaded,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@hive/assets/css/semantic.css";

.wrapper {
  overflow-y: auto;
  overflow-x: auto;
}

.hive-grid {
  border-spacing: 0;
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow-y: visible;
  overflow-x: visible;

  & tr.even {
    background-color: #ffffff;
  }

  & tr.odd {
    background-color: rgba(0, 0, 0, 0.04);
  }

  & td {
    padding: 8px 12px;
    border-width: 0 0 0 1px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.08);
  }
}

.pagination-item {
  display: flex;
  align-items: center;
  width: fit-content;
  margin-top: 6px;
  margin-bottom: 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  justify-content: space-between;
  user-select: none;
  color: rgb(80, 80, 80);

  .pagination-item_svg {
    fill: rgb(80, 80, 80);
    transition: fill 0.2s;
    height: 25px;
    width: 25px;

    &:hover {
      fill: rgba(176, 221, 255, 0.8980392157);
      cursor: pointer;
      &.disabled {
        fill: rgb(80, 80, 80);

        cursor: not-allowed;
      }
    }
  }

  .pagination_navigation-current {
    font-size: 20px;
  }

  .delete-icon {
    font-size: 10px;
    color: red;
  }

  .gap {
    gap: 5px;
  }
}
</style>
