<template>
  <li>
    <div
      class="name-wrapepr"
      :class="{ clickable: hasChildren, choosen: children?.choosen }"
    >
      <span
        v-if="hasChildren"
        class="collapse-item"
        @click="toggleIsShown"
        :class="{ rotated: isShown }"
      >
        <img src="./assets/arrow_right_FILL0_wght400_GRAD0_opsz48.svg" />
      </span>

      <HiveCheckbox :name="node?.name" title="" v-model="check" />

      <span class="name" @click="choose">
        <img
          v-if="node?.img"
          :src="typeof node?.img === 'string' ? node?.img : node?.img?.src"
          class="img"
        />

        <span>
          {{ node?.name }}
        </span>
      </span>
    </div>
    <template v-if="hasChildren">
      <div v-show="isShown">
        <ul>
          <HiveTreeViewNode
            v-for="(n, index) in node?.children"
            :key="index"
            :node="n"
            :children="options ? options?.children[index] : undefined"
            :choosen="choosen"
            @event="emitHelper"
          />
        </ul>
      </div>
    </template>
  </li>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  type PropType,
  type Ref,
  ref,
  toRef,
  watch,
} from "vue";
import useComponent from "@/common/hooks/base/use-component";
import useEventHandler, {
  EventData,
} from "@/common/hooks/base/use-event-handler";
import HiveCheckbox from "../hive-checkbox/HiveCheckbox.vue";
import useOnMount from "@/common/hooks/base/use-on-mount";
import type { TreeView } from "./hive-tree-view-type";
import commonProps from "@/common/mixins/common-props";

export default defineComponent({
  name: "HiveTreeViewNode",
  props: {
    node: Object as PropType<TreeView>,
    show: {
      type: Boolean,
      default: true,
    },
    modelValueEventName: {
      type: String,
      default: "onAfterChange",
    },
    children: Object as PropType<TreeView>,
    choosen: Object,
    ...commonProps,
  },
  mounted() {
    useOnMount(this);
  },
  setup(props, context) {
    const { component } = useComponent(props);

    const isShown = ref(props.show);

    const toggleIsShown = () => {
      isShown.value = !isShown.value;
    };
    const hasChildren = computed(
      () => props.node?.children && props.node?.children.length !== 0
    );

    const options = props.children;

    const check: Ref<boolean | undefined> = toRef(props.children!, "checked");

    const handleEvent = useEventHandler({
      props,
      context,
      modelValue: check,
      component,
      modelValueEventName: props.modelValueEventName,
    });

    const choose = () => {
      handleEvent(new Event("onChoose"), {
        name: options?.name,
      });
      options!.choosen = !options!.choosen;
      if (props.choosen?.node && props.choosen?.node.name !== options?.name) {
        props.choosen.node.choosen = false;
      }
      if (options?.choosen) {
        props.choosen!.node = options;
      }
    };

    watch(check, () => {
      handleEvent(new Event("onCheck"), {
        name: props.node?.name,
        checked: check.value,
      });
      let value = true;
      props.children?.children?.forEach((el) => {
        value = value && el.checked!;
      });
      if (check.value || value) {
        props.children?.children.forEach((el) => {
          el.checked = check.value;
        });
      }
    });

    watch(
      () => props.children?.children,
      () => {
        let value = true;
        props.children?.children?.forEach((el) => {
          value = value && el.checked!;
        });
        check.value = value;
      },
      { deep: true }
    );

    const emitHelper = (event: EventData) => {
      switch (event.type) {
        case "onCheck":
          handleEvent(new Event(event.type), {
            name: (event?.data as any).name,
            checked: (event?.data as any).checked,
          });
          break;
        case "onChoose":
          handleEvent(new Event(event.type), {
            name: (event?.data as any).name,
          });
          break;
      }
    };

    return {
      isShown,
      toggleIsShown,
      hasChildren,
      options,
      check,
      choose,
      handleEvent,
      component,
      emitHelper,
    };
  },
  components: { HiveCheckbox },
});
</script>

<style lang="scss" scoped>
ul {
  user-select: none;
  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
  outline: 0;
}

li {
  list-style-type: none;
  padding-left: 16px;
}

.collapse-item {
  transition: all 0.2s;
  height: 20px;
}

.clickable {
  margin-left: -20px;
  display: flex;
  align-items: center;
}

.rotated {
  rotate: 90deg;
}

.active {
  rotate: 90deg;
}

.clickable {
  cursor: pointer;
}

.name {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.img {
  width: 30px;
  height: 30px;
}
.name-wrapepr {
  width: fit-content;
  display: flex;
  align-items: center;
  padding: 0 4px;
  border-radius: 2px;
  cursor: pointer;
}

.choosen {
  background-color: #000f9938;
}
</style>
