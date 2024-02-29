<script setup lang="ts">
import { type Ref, computed, onMounted, ref, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import WidgetWrapper from '@/WidgetWrapper.vue';
import { HiveButton, HiveDialog, HiveLoader, HiveTextarea } from '../.';
import HiveInput from '../components/hive-input/hive-input.vue';
import HiveInputSearch from '../components/hive-input-search/hive-input-search.vue';
import HiveDropDown from '../components/hive-drop-down/hive-drop-down.vue';
import HiveRadioGroup from '../components/hive-radio-group/hive-radio-group.vue';
import HiveCheckboxGroup from '../components/hive-checkbox-group/hive-checkbox-group.vue';
import HiveCheckbox from '../components/hive-checkbox/hive-checkbox.vue';
import HiveMultiselect from '../components/hive-multiselect/hive-multiselect.vue';
import HiveBadge from '../components/hive-badge/hive-badge.vue';
import hiveNotificationWrapper from '../components/hive-notification/hive-notification-wrapper.vue';
import type { Option } from '@/common/types/option';
import { useYearStore } from './stores/years';
import HiveUploadFile from '@/components/hive-upload-file/hive-upload-file.vue';
import { useNotification } from '../plugins/hive-notification';
import HiveSplitter from '../components/hive-splitter/hive-splitter.vue';
import HivePane from '../components/hive-splitter/hive-pane.vue';
import HiveHtmlEditor from '../components/hive-html-editor/hive-html-editor.vue';
import HiveAutocomplete from '../components/hive-autocomplete/hive-autocomplete.vue';
import HiveMultiautocomplete from '../components/hive-multiautocomplete/hive-multiautocomplete.vue';
import HiveTabGroup from '../components/hive-tab-group/hive-tab-group.vue';
import HiveTab from '../components/hive-tab-group/hive-tab.vue';
import HiveListLoader from '../components/hive-list-loader/hive-list-loader.vue';
import HiveSkeleton from '../components/hive-skeleton/hive-skeleton.vue';
import HiveGrid from '../components/hive-grid/hive-grid.vue';
import type { GridColumns } from '../components/hive-grid/types';
import HiveTreeView from '../components/hive-tree-view/hive-tree-view.vue';
import { VueComponent } from '../common/types/value';
import HiveGridRow from '../components/hive-grid/hive-grid-row.vue';
import hiveContextMenu from '../components/hive-context-menu/hive-context-menu.vue';
import { ContextMenuItems } from '../components/hive-context-menu/types';
import type { HiveUploadFilesType } from '@/components/hive-upload-file/hive-upload-file-type.ts';
import FilterNew from './components/filter-new.vue';

const text = ref('text');
const num = ref(0);
const numMin = ref(0);
const inputText = ref('');
const isOpenModal = ref(false);
const dropdown = ref();
const autocomplete = ref('');
const multiautocomplete = ref(null);
const dd3 = ref(0);

const handleText = () => {
  console.log('click');
  text.value = 'onClick';
};

const handleNum = () => {
  console.log('click');
  num.value = 1000;
};

const handleR = () => {
  console.log('clickRRR');
};

const input = ref('');

const options = [
  {
    title: '1',
    id: '1',
  },
  {
    title: '2',
    id: '2',
  },
  {
    title: '3',
    id: '3',
  },
  {
    title: '4',
    id: '4',
  },
];

const textEditor = ref('');

let optionsTest: Option[] | undefined;

const autoCompleteOptions = ref(['И', 'НЕ', 'ИЛИ', '(', ')', '<->', '<2>']);

setTimeout(() => {
  optionsTest = [
    {
      // key: 'key1',
      // title: 'title3',
      // value: 'value3',
      valu: '2023',
      titl: 't2023',
      // key: '0',
    },
    {
      // key: 'key2',
      // title: 'title2',
      // value: 'value2',
      valu: '2022',
      titl: 't2022',
      // key: '1',
    },
    {
      // key: 'key3',
      // title: 'title1',
      // value: 'value1',
      valu: '2024',
      titl: 't2024',
      // key: '2',
    },
  ];
});

const optionsObjectSort =
  //computed(() => optionsTest);
  [
    {
      // key: 'key1',
      // title: 'title3',
      // value: 'value3',
      valu: '2023',
      titl: 't2023',
      // key: '0',
    },
    {
      // key: 'key2',
      // title: 'title2',
      // value: 'value2',
      valu: '2022',
      titl: 't2022',
      // key: '1',
    },
    {
      // key: 'key3',
      // title: 'title1',
      // value: 'value1',
      valu: '2024',
      titl: 't2024',
      // key: '2',
    },
    {
      // key: 'key1',
      // title: 'title3',
      // value: 'value3',
      valu: '2023',
      titl: 't2023',
      // key: '0',
    },
  ];

const optionsArray = [
  {
    key: 'key1',
    title: 'title1',
    value: 'value1',
  },
  {
    key: 'key2',
    title: 'title2',
    value: 'value2',
  },
  {
    key: 'key3',
    title: 'title3',
    value: 'value3',
  },
  {
    key: 'key4',
    title: 'title4',
    value: 'value4',
  },
  {
    key: 'key5',
    title: 'title5',
    value: 'value5',
  },
  {
    key: 'key6',
    title: 'title6',
    value: 'value6',
  },
  {
    key: 'key7',
    title: 'title7',
    value: 'value7',
  },
  {
    key: 'key8',
    title: 'title8',
    value: 'value8',
  },
  {
    key: 'key9',
    title: 'title9',
    value: 'value9',
  },
];

// const dd4 = ref('74fd8aaa-e10a-4fd0-941b-6f6c7249003d')
const dd4 = ref(null);

// const optionsObject = ref(null);

// setTimeout(() => {
// @ts-ignore
const optionsObject = {
  '1': {
    title: 'Российская Федерация',
    id: '74fd8aaa-e10a-4fd0-941b-6f6c7249003d',
    classifier_id: '2e72e478-2e35-437c-aeea-0d6da10138ae12',
  },
  '2': {
    title: 'Республика Беларусь',
    id: 'cefa7ecc-9e64-425d-bfdb-2dc89a0c9c5f',
    classifier_id: '2e72e478-2e35-437c-aeea-0d6da10138ae',
  },
};
// }, 1000);

const maritalStatusList = ref([
  {
    id: 0,
    title: 'холост',
  },
  {
    id: 1,
    title: 'женат',
  },
  {
    id: 2,
    title: 'женат2',
  },
]);

// setTimeout(() => {
//   maritalStatusList.value = [
//     {
//       id: 0,
//       title: 'холост',
//     },
//     {
//       id: 1,
//       title: 'женат',
//     },
//     {
//       id: 2,
//       title: 'женат2',
//     },
//   ];
// }, 2000);
const mm = ref(null);

const statusList = [
  {
    id: '7f23',
    description: 'зарегистрирован',
    title: 'Зарегистрирован',
    type: 0,
  },
  {
    id: null,
    description: '',
    title: 'Черновик',
    type: null,
  },
];

const radioGroup = ref('женат');
const checkbox = ref([0]);
const check = ref(false);
const checkName = 'Active';

const checkCurrent = {
  title: 'Activ',
  value: false,
};
const multiselect = ref(null);

const date: Ref<Date | undefined> = ref();

const yearStore = useYearStore();
const yearList = computed(() => yearStore.years);

onMounted(() => {
  yearStore.getYears();
});

const handleSearch = (value: string) => {
  console.log('val', value);
};

const { notify } = useNotification();

const create = () =>
  notify({
    title: 'Уведомление',
    text: 'Уведомление было получено!',
    type: 'success',
  });

const tab = ref('');

const columns: Ref<GridColumns[]> = ref([
  {
    title: 'Name',
    field: 'name',
    width: 300,
  },
  {
    title: 'Age',
    field: 'age',
    editType: 'number',
    cssClass: (row: unknown) => ((row as any)?.age > 18 ? 'name-grid' : ''),
  },
  {
    title: 'bool',
    field: 'bool',
    editType: 'checkbox',
  },
  {
    title: 'Действия',
    field: 'actions',
    editable: false,
  },
]);

const rows = ref([
  // { id:1, name:"John", age: 20, createdAt: '2018-02-18T00:00:43-05:00',score: 0.03343 },
  {
    id: 2,
    name: 'Jane',
    age: 26,
    createdAt: '2011-10-31',
    score: 0.03343,
    bool: false,
    exact: 'match',
    average: 1,
  },
  {
    id: 2,
    name: 'Jane',
    age: 24,
    createdAt: '2011-10-31',
    score: 0.03343,
    bool: true,
    exact: 'match',
    average: 1,
  },
  {
    id: 3,
    name: 'Angel',
    age: 16,
    createdAt: '2011-10-30',
    score: 0.03343,
    bool: true,
    exact: 'match',
    average: null,
  },
  {
    id: 4,
    name: 'Chris',
    age: 55,
    createdAt: '2011-10-11',
    score: 0.03343,
    bool: false,
    exact: null,
  },
  {
    id: 5,
    name: 'Dan',
    age: 40,
    createdAt: '',
    score: 0.03343,
    bool: null,
    exact: 'rematch',
    average: 2,
  },
  {
    id: 213213,
    name: '193.23',
    age: 20,
    createdAt: null,
    score: 0.03343,
    bool: null,
    exact: 'rematch',
    average: 3,
  },
  {
    id: 6,
    name: 'John',
    age: 20,
    createdAt: '2011-10-31',
    score: 0.03343,
    bool: true,
    exact: 'match',
    average: 1.5,
  },
  {
    id: 7,
    name: 'Ángel',
    age: 20,
    createdAt: '2013-09-21',
    score: null,
    bool: 'false',
    exact: null,
    average: 1,
  },
  {
    id: 8,
    name: 'Susan',
    age: 16,
    createdAt: '2013-10-31',
    score: 0.03343,
    bool: true,
    exact: 'rematch',
    average: 1,
  },
]);

const grid = ref(null);

const currentTab = ref('1');

const prevRow: Ref<InstanceType<typeof HiveGridRow> | null> = ref(null);

const log = (row: Record<string, unknown>, rowRef: VueComponent<typeof HiveGridRow> | null) => {
  if (rowRef && rowRef.style) {
    rowRef.style.background = 'red';
    if (prevRow.value?.style?.background) {
      prevRow.value.style.background = 'inherit';
    }
    if (prevRow.value !== rowRef) {
      prevRow.value = rowRef;
    } else {
      prevRow.value = null;
    }
  }
};

const changeRows = () => {
  rows.value = [
    // { id:1, name:"John", age: 20, createdAt: '2018-02-18T00:00:43-05:00',score: 0.03343 },
    {
      id: 2,
      name: 'Jane',
      age: 26,
      createdAt: '2011-10-31',
      score: 0.03343,
      bool: false,
      exact: 'match',
      average: 1,
    },
    {
      id: 2,
      name: 'Jane',
      age: 24,
      createdAt: '2011-10-31',
      score: 0.03343,
      bool: true,
      exact: 'match',
      average: 1,
    },
    {
      id: 3,
      name: 'Angel',
      age: 16,
      createdAt: '2011-10-30',
      score: 0.03343,
      bool: true,
      exact: 'match',
      average: null,
    },
    {
      id: 4,
      name: 'Chris',
      age: 55,
      createdAt: '2011-10-11',
      score: 0.03343,
      bool: false,
      exact: null,
    },
    {
      id: 5,
      name: 'Dan',
      age: 40,
      createdAt: '',
      score: 0.03343,
      bool: null,
      exact: 'rematch',
      average: 2,
    },
  ];
};

const mltsval = ref([]);

// @ts-ignore
const universalLog = (...args: any[]) => {
  console.log(args);
};

const treeNodes = ref([
  {
    name: '1',
    id: '1',
    children: [
      {
        name: '3',
        id: '3',
      },
    ],
  },
  {
    name: '2',
    id: '2',
  },
  {
    name: '4',
    id: '4',
    children: [
      {
        name: '5',
        id: '5',
      },
      {
        name: '6',
        id: '6',
        children: [
          {
            name: '7',
            id: '7',
          },
        ],
      },
    ],
  },
  {
    name: '8',
    id: '8',
  },
  {
    name: '9',
    id: '9',
    children: [
      {
        name: '10',
        id: '10',
      },
      {
        name: '11',
        id: '11',
      },
      {
        name: '12',
        id: '12',
        children: [
          {
            name: '13',
            id: '13',
          },
          {
            name: '14',
            id: '14',
          },
        ],
      },
    ],
  },
  {
    name: '15',
    id: '15',
    children: [
      {
        name: '16',
        id: '16',
        children: [
          {
            name: '17',
            id: '17',
          },
          {
            name: '18',
            id: '18',
          },
        ],
      },
    ],
  },
  {
    name: '19',
    id: '19',
  },
  {
    name: '20',
    id: '20',
    children: [
      {
        name: '21',
        id: '21',
      },
      {
        name: '22',
        id: '22',
      },
      {
        name: '23',
        id: '23',
        children: [
          {
            name: '24',
            id: '24',
          },
          {
            name: '25',
            id: '25',
          },
        ],
      },
    ],
  },
]);

const click = () => {
  treeNodes.value = [
    {
      name: '4',
      id: '4',
      children: [
        {
          name: '5',
          id: '5',
        },
        {
          name: '6',
          id: '6',
          children: [
            {
              name: '7',
              id: '7',
            },
          ],
        },
      ],
    },
  ];
};

const contextMenuItems: Ref<ContextMenuItems> = ref([
  {
    label: 'Дейтсвия',
  },
  {
    separator: true,
  },
  {
    label: 'Скрыть меню',
    closeOnClick: true,
  },
]);

const files: Ref<HiveUploadFilesType | null> = ref(null);

const handleAdd = () => {
  if (files.value?.files[0]) {
    console.log('add', files.value?.files);
  }
};

const onInput = (value: unknown) => {
  console.log('input', value);
};

const mask = 'C*@A.A';
const tokens = 'C:[A-z0-9]|*:[0-9A-z.,_]:multiple|A:[a-z]:multiple|@:@';

const searchString = ref('');

const store = useYearStore();

const a = computed(() => store.a);
</script>

<template>
  <hive-loader :visible="false" />

  <div class="app">
    <filter-new />
  </div>
  <notifications position="bottom center" />
</template>

<style lang="scss">
.name-grid {
  background-color: red;
}
</style>

<style scoped lang="scss">
.app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
}
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 400px;
}

.img {
  width: 15px;
  height: 15px;
}

.test {
  background-color: aqua;
  z-index: 1;
}
</style>
