<template>
  <li>
    <div
      class="name-wrapper"
      :class="{
        clickable: hasChildren,
        withOutChildren: !hasChildren,
        choosen: children?.hive_tree_node_id === choosen?.node?.hive_tree_node_id,
      }"
      draggable="true"
      @drag="drag"
    >
      <span v-if="hasChildren" class="collapse-item" @click="toggleIsShown" :class="{ rotated: isShown }">
        <img class="arrow" src="./assets/arrow_right_FILL0_wght400_GRAD0_opsz48.svg" />
      </span>

      <HiveCheckbox v-if="withCheckboxes" :name="node?.name" title="" v-model="check" class="name-checkbox" />

      <slot name="main" :choose="choose" :img="node?.img" :defaultImage="image" :node="node">
        <span class="name" @click="choose">
          <img
            v-if="node?.img"
            :src="typeof node?.img === 'string' ? node?.img : node?.img?.src"
            class="img"
            draggable="false"
          />
          <img v-if="image" :src="image" class="img" draggable="false" />

          <span>
            {{ node?.name }}
          </span>
        </span>
      </slot>

      <slot name="after" :node="node" />
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
            :checked-all="checkedAll"
            :with-checkboxes="withCheckboxes"
            :img-array="imgArray"
            :allClosed="allClosed"
          >
            <template #main="{ choose, node, defaultImage }">
              <slot name="main" :choose="choose" :img="node?.img" :defaultImage="defaultImage" :node="node" />
            </template>
            <template #after="{ node }">
              <slot name="after" :node="node" />
            </template>
          </HiveTreeViewNode>
        </ul>
      </div>
    </template>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent, type PropType, type Ref, ref, toRef, watch, onMounted } from 'vue';
import useComponent from '@/ui-kit/src/common/hooks/base/use-component';
import useEventHandler, { EventData } from '@/ui-kit/src/common/hooks/base/use-event-handler';
import HiveCheckbox from '../hive-checkbox/HiveCheckbox.vue';
import useOnMount from '@/ui-kit/src/common/hooks/base/use-on-mount';
import type { TreeImg, TreeView } from './hive-tree-view-type';
import commonProps from '@/ui-kit/src/common/mixins/common-props';

export default defineComponent({
  name: 'HiveTreeViewNode',
  props: {
    node: Object as PropType<TreeView>,
    show: {
      type: Boolean,
      default: true,
    },
    modelValueEventName: {
      type: String,
      default: 'onAfterChange',
    },
    withCheckboxes: {
      type: Boolean,
      default: true,
    },
    children: Object as PropType<TreeView>,
    choosen: Object,
    checkedAll: {
      type: Boolean,
      default: false,
    },
    imgArray: {
      type: Object as PropType<TreeImg[]>,
      required: false,
    },
    allClosed: {
      type: Boolean,
      default: false,
    },
    ...commonProps,
  },
  mounted() {
    useOnMount(this);
  },
  emits: ['onDragStart', 'onDragEnd'],
  setup(props, context) {
    const { component } = useComponent(props);

    const isShown = ref(props.show);

    if (props.allClosed) {
      isShown.value = false;
    }

    const toggleIsShown = () => {
      isShown.value = !isShown.value;
    };
    const hasChildren = computed(() => props.node?.children && props.node?.children.length !== 0);

    const options = computed(() => props.children);

    const check: Ref<boolean | undefined> = toRef(props.children!, 'checked');

    const dragStarted = ref(false);

    watch(
      () => props.imgArray,
      () => {
        getImage();
      }
    );

    const image = ref('');
    const getImage = () => {
      if (props.imgArray && props.imgArray?.length !== 0) {
        for (let i = 0; i < props.imgArray?.length; i++) {
          // @ts-ignore
          // console.log(props.node[props.imgArray[i].key], props.imgArray[i].value);
          // @ts-ignore
          if (props.node[props.imgArray[i].key] === props.imgArray[i].value) {
            image.value = props.imgArray[i].img;
          }
        }
      }
    };

    watch(
      () => props.imgArray?.length,
      () => {
        getImage();
      }
    );

    const handleEvent = useEventHandler({
      props,
      context,
      modelValue: check,
      component,
      modelValueEventName: props.modelValueEventName,
    });

    const drag = (event: DragEvent) => {
      if (!dragStarted.value) {
        document.addEventListener('dragend', dragEnd);
        console.log(event);
        handleEvent(new Event('onDragStart'), { node: props.node });
      }
      dragStarted.value = true;
    };

    const dragEnd = (event: MouseEvent) => {
      if (dragStarted.value) {
        dragStarted.value = false;
        document.removeEventListener('dragend', dragEnd);
        console.log(event);
        handleEvent(new Event('onDragEnd'), { node: props.node });
      }
    };

    const choose = () => {
      handleEvent(new Event('onChoose'), {
        name: options.value?.name,
        ...options.value,
        id: options.value?.id,
      });
      options.value!.choosen = !options.value!.choosen;
      if (props.choosen?.node && props.choosen?.node.name !== options.value?.name) {
        props.choosen.node.choosen = false;
      }
      if (options.value?.choosen) {
        props.choosen!.node = options.value;
      }
    };

    watch(check, () => {
      handleEvent(new Event('onCheck'), {
        name: props.node?.name,
        checked: check.value,
        id: props.id,
        ...props.node,
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
      () => props.children?.checked,
      () => {
        check.value = props.children?.checked;
      }
    );

    watch(
      () => props.children?.children,
      () => {
        let value = true;
        props.children?.children?.forEach((el) => {
          value = value && el.checked!;
        });
        if (props.children?.children.length && props.children?.children.length > 0) {
          check.value = value;
        }
      },
      { deep: true }
    );

    onMounted(() => {
      handleEvent(new Event('onMount'), {
        id: props.id,
        ...props.node,
      });
    });

    const emitHelper = (event: EventData) => {
      switch (event.type) {
        case 'onCheck':
          handleEvent(new Event(event.type), {
            ...(event.data as object),
          });
          break;
        case 'onChoose':
          handleEvent(new Event(event.type), {
            name: (event?.data as any).name,
            subdivision_id: (event?.data as any).subdivision_id,
            classifier_id: (event?.data as any).classifier_id,
            id: (event?.data as any).id,
          });
          break;
        case 'onMount':
          handleEvent(new Event(event.type), {
            ...(event.data as any),
          });
          break;
        case 'onDragStart':
          handleEvent(new Event(event.type), {
            ...(event.data as any),
          });
        case 'onDragEnd':
          handleEvent(new Event(event.type), {
            ...(event.data as any),
          });
      }
    };

    return {
      isShown,
      hasChildren,
      options,
      check,
      component,
      image,
      dragEnd,
      handleEvent,
      toggleIsShown,
      choose,
      emitHelper,
      drag,
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
  width: 20px;
}

.arrow {
  min-height: 20px;
  min-width: 20px;
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
  font-size: 15px;
  flex-grow: 100;
  cursor: pointer;
  .img {
    width: 30px;
    height: 30px;
  }
}

.name-wrapper {
  width: fit-content;
  display: flex;
  align-items: center;
  padding: 5px 4px;
  border-radius: 2px;
  gap: 10px;
  width: 100%;
}

.name-checkbox {
  margin-top: 3px;
  max-width: 17px;
}

.choosen {
  background-color: #000f9938;
}

.withOutChildren {
  margin-left: 9px;
  width: calc(100% - 29px);
}
</style>
