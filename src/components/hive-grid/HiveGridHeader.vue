<template>
  <thead class="hive-grid__header">
    <th>
      <HiveButton text="Add Top" @click="addTop" />
      <HiveButton text="Add Bottom" @click="addBottom" />
    </th>
    <th
      v-for="item in columns"
      :key="item.field"
      @click="$emit('sort', item.field)"
      :class="{ 'cursor-pointer': item.sortable }"
    >
      {{ item.title }}
    </th>
  </thead>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import commonProps from "@hive/common/mixins/common-props";
import useComponent from "@hive/common/hooks/base/use-component";
import useEventHandler, {
  type EventConfig,
} from "@hive/common/hooks/base/use-event-handler";
import useOnMount from "@hive/common/hooks/base/use-on-mount";
import getRows from "@hive/components/hive-grid/helpers/get-rows";
import type {
  ColumnWithChildren,
  ColumnWithoutChildren,
} from "@hive/components/hive-grid/types";
import type { GridColumns } from "@hive/components/hive-grid/hooks/use-hive-grid";
import HiveButton from "../hive-button/HiveButton.vue";

export default defineComponent({
  name: "HiveGridHeader",
  props: {
    columns: {
      type: Array as PropType<GridColumns[]>,
    },
    ...commonProps,
  },
  emits: ["sort"],
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

    const rows = getRows(
      props.columns as ColumnWithChildren[] | ColumnWithoutChildren[]
    );

    const addTop = () => {
      handleEvent(new Event("addTop"));
    };

    const addBottom = () => {
      handleEvent(new Event("addBottom"));
    };

    return {
      component,
      handleEvent,
      rows,
      addTop,
      addBottom,
    };
  },
  components: { HiveButton },
});
</script>

<style lang="scss" scoped>
.hive-grid__header {
  background-color: #fafafa;
  border: 1px solid rgba(0, 0, 0, 0.08);

  & th {
    border-width: 0 0 1px 1px;
    border-style: solid;
    border-color: inherit;
    padding: 4px;
    user-select: none;

    &:first-child {
      border-left-width: 0;
    }
  }
}
</style>
