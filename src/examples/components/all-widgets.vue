<script setup lang="ts">
import { type Ref, computed, onMounted, ref, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import WidgetWrapper from '@/WidgetWrapper.vue';
import {} from '../../.';
import {
  HiveInput,
  HiveInputSearch,
  HiveDropDown,
  HiveRadioGroup,
  HiveCheckboxGroup,
  HiveCheckbox,
  HiveMultiselect,
  HiveBadge,
  HiveButton,
  HiveDialog,
  HiveLoader,
  HiveTextarea,
  HiveSplitter,
  HivePane,
  HiveHtmlEditor,
  HiveAutocomplete,
  HiveMultiautocomplete,
  HiveTabGroup,
  HiveTab,
  HiveListLoader,
  HiveSkeleton,
  HiveGrid,
  HiveUploadFile,
  HiveTreeView,
  HiveGridRow,
  useNotification,
  type HiveUploadFilesType,
} from '@/index';
import type { Option } from '@/common/types/option';
import { useYearStore } from '../stores/years';
import type { GridColumns } from '../../components/hive-grid/types';
import { VueComponent } from '../../common/types/value';
import hiveContextMenu from '../../components/hive-context-menu/hive-context-menu.vue';
import { ContextMenuItems } from '../../components/hive-context-menu/types';
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

withDefaults(
  defineProps<{
    dark?: boolean;
  }>(),
  {
    dark: false,
  },
);

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
    id: 1,
    title: 'холост',
  },
  {
    id: 2,
    title: 'женат',
  },
  {
    id: 3,
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
const multiselect: Ref<string[]> = ref([]);

setTimeout(() => {
  categoriesOptions.value = [
    { name: 'аудиоверсия', value: 'аудиоверсия' },
    { name: 'мнимая проза', value: 'мнимая_проза' },

    { name: 'городской бестиарий', value: 'городской_бестиарий' },
    { name: 'ночной эфир', value: 'ночной_эфир' },
    { name: 'десять сказок о', value: 'десять_сказок_о' },
    { name: 'мини-конкурс', value: 'миниконкурс' },
    { name: 'Игра в одиноком октябре', value: 'Игра_в_одиноком_октябре' },
  ];
}, 2000);

const categoriesOptions = ref([
  { name: 'мнимая проза', value: 'мнимая_проза' },
  { name: 'проза', value: 'сказка' },
  { name: 'стихи', value: 'стихи' },
]);

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

const optionsObject1 = {
  a: 'b',
  c: 'd',
};
</script>

<template>
  <hive-loader :visible="false" />

  <div class="app">
    <!-- <filter-new />
     <hive-drop-down v-model="searchString" :options="rows" title-field="id" value-field="id"/>
    <hive-drop-down v-model="searchString" :options="rows" title-field="id" value-field="id"/> -->
    <div class="wrapper">
      <hive-input-search
        v-model="searchString"
        :is-opened="true"
        placeholder="Поиск"
        btn-background-color="#33333340"
      />
      <hive-button title="clear search" @click="searchString = ''" />

      <!-- Button -->
      <widget-wrapper title="Button">
        <hive-button>
          <template #before>Before</template>
          <img src="@/assets/search.svg" alt="image after" class="img" />
          Click
          <img src="@/assets/search.svg" alt="image before" class="img" />
          <template #after>After</template>
        </hive-button>
        <hive-button disabled />
        <hive-button />
        <hive-button :style="{ backgroundColor: 'red' }" @click.right.prevent="handleR" />
        <hive-button title="Tree" :class="'test'" @click="click" />
        <hive-button title="Notify" :class="'test'" @click="create" />
      </widget-wrapper>

      <!-- Textarea -->
      <widget-wrapper title="Textarea">
        {{ text }}
        <hive-textarea v-model="text" resize-direction="both" :style="{ width: '300px' }" disabled />
      </widget-wrapper>

      <!-- Input -->
      <widget-wrapper title="Input">
        <div>{{ text }}</div>
        <div>{{ num }}</div>
        <hive-button title="Classes" :class="'test'" @click="handleNum" />

        <hive-input v-model="text" invalid @input="onInput" />
        <hive-input v-model="input" invalid @input="onInput" placeholder="Placeholder" />
        <hive-input v-model="num" :mask="mask" :tokens="tokens" title="Title" @input="onInput" />
        <hive-input v-model="num" type="number" @input="onInput" :step="1" />
        <hive-badge :counter="5" :mode="1" />
      </widget-wrapper>

      <!-- Modal -->
      <widget-wrapper title="Modal">
        <hive-button @click="isOpenModal = true" />

        <hive-dialog v-model="isOpenModal" :hive-theme="dark ? 'dark' : 'light'" withCloseButton title="Hello world">
          <template #header>
            <!-- <hive-button title="close" /> -->
            ривэд эдвэд
            FFFFFFFFFFFFFddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
          </template>

          Hello

          <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px', height: '500px' }">
            <hive-input v-model="text" invalid />
            <hive-multiselect
              :options="categoriesOptions"
              v-model="multiselect"
              title-field="name"
              value-field="value"
            />
            <hive-textarea v-model="text" resize-direction="both" :style="{ width: '300px' }" />
            <!-- <hive-drop-down v-model="dropdown" :options="optionsObject" :style="{ width: '300px' }" /> -->
            <!-- <hive-drop-down v-model="dropdown" :options="optionsObject" :style="{ width: '300px' }" menu-width="0px" /> -->
            <!-- <hive-drop-down v-model="dd3" :options="yearList" title-field="title" value-field="value" /> -->
            <!-- <hive-drop-down v-model="mm" :options="yearList" title-field="title" value-field="id" /> -->
            <hive-button />
          </div>

          <template #footer>
            <hive-button title="close" />
          </template>
        </hive-dialog>
      </widget-wrapper>

      <!-- DropDown -->
      <widget-wrapper title="DropDown">
        {{ dd3 }}
        <br />
        {{ dd4 }}
        <br />
        {{ mm }}
        {{ dropdown }}
        <hive-drop-down v-model="dd3" :options="optionsObject1" />
        <hive-drop-down
          v-model="dropdown"
          :options="options"
          value-field="title"
          title-field="title"
          with-null
          style="width: 300px"
        />
        <hive-drop-down v-model="dd4" :options="optionsArray" title-field="title" value-field="value" />
        <hive-drop-down
          v-model="mm"
          :options="maritalStatusList"
          title-field="title"
          value-field="id"
          with-null
          height="100px"
        />
        <hive-drop-down v-model="mm" :options="statusList" title-field="title" value-field="id" />
      </widget-wrapper>
      <!-- RadioGroup -->
      <widget-wrapper title="Radio">
        {{ radioGroup }}
        <hive-radio-group :options="maritalStatusList" v-model="radioGroup" title-field="title" value-field="title" />
      </widget-wrapper>
      <widget-wrapper title="Checkbox">
        {{ checkbox }}
        <hive-checkbox-group
          :options="optionsObject ?? undefined"
          v-model="checkbox"
          title-field="title"
          value-field="classifier_id"
        />
        <!-- <hive-checkbox-group :options="maritalStatusList" v-model="check" title-field="title" value-field="id" /> -->
        <!-- <hive-checkbox :option="checkName" v-model="check" /> -->
      </widget-wrapper>
      <widget-wrapper title="Multiselect">
        {{ checkbox }}
        <!-- <hive-multiselect :options="maritalStatusList" v-model="multiselect" title-field="title" value-field="id" /> -->
        <hive-multiselect :options="categoriesOptions" v-model="multiselect" title-field="name" value-field="value" />
        <hive-textarea v-model="text" resize-direction="both" :style="{ width: '300px' }" disabled />
      </widget-wrapper>
      <widget-wrapper title="Autocompelte">
        {{ autocomplete }}
        <hive-button @click="autocomplete = 'sadasd'" />
        <hive-autocomplete v-model="autocomplete" :options="autoCompleteOptions" :style="{ width: '300px' }" />
      </widget-wrapper>
      <widget-wrapper title="Multiautocompelte">
        {{ autocomplete }}
        <hive-multiautocomplete
          v-model="multiautocomplete"
          :options="autoCompleteOptions"
          :style="{ width: '300px' }"
          :distinct="false"
        />
      </widget-wrapper>
      <widget-wrapper title="HiveUploadFile">
        <hive-upload-file @file-add="handleAdd" ref="files" multiple />
      </widget-wrapper>
      <widget-wrapper title="Splitter" :class="{ 123: 1 }">
        <hive-splitter style="height: 400px">
          <hive-pane min-size="20" id="1">1</hive-pane>
          <hive-pane id="2">5</hive-pane>
        </hive-splitter>
      </widget-wrapper>
      <widget-wrapper title="Autocompelte">
        {{ autocomplete }}
        <hive-autocomplete v-model="autocomplete" :options="autoCompleteOptions" :style="{ width: '300px' }" />
      </widget-wrapper>
      <widget-wrapper title="Multiautocompelte">
        {{ autocomplete }}
        <hive-multiautocomplete
          v-model="multiautocomplete"
          :options="autoCompleteOptions"
          :style="{ width: '300px' }"
          :distinct="false"
        />
      </widget-wrapper>
      <widget-wrapper title="Tab">
        {{ autocomplete }}
        <hive-tab-group v-model="tab">
          <hive-tab name="first" id="1">
            <div style="">asd</div>
            <div style="">asd</div>
            <div style="">asd</div>
            <div style="">asd</div>
            <div style="">asd</div>
            <div style="">asd</div>
            <div style="">asd</div>
            <div style="">asd</div>
            <div style="">asd</div>
            <div style="">asd</div>
            <div style="">asd</div>
            <div style="">asd</div>
          </hive-tab>
          <hive-tab name="second" id="2">cvb</hive-tab>
          <hive-tab name="third" id="3">fgh</hive-tab>
          <hive-tab name="fourth" id="4">ytiu</hive-tab>
        </hive-tab-group>
      </widget-wrapper>
      <widget-wrapper title="HtmlEditor" :class="{ 123: 1 }">
        {{ textEditor }}
        <div v-html="textEditor" />
        <hive-html-editor v-model="textEditor" :style="{ height: '300px' }" />
      </widget-wrapper>
      <widget-wrapper title="ListLoader">
        <hive-list-loader :visible="true" colorMain="red" colorSpinner="#0bef12" />
      </widget-wrapper>
      <widget-wrapper title="Skeleton">
        <hive-skeleton :visible="true" />
      </widget-wrapper>
      <widget-wrapper title="Grid">
        <hive-button @click="changeRows" />
        <HiveGrid
          ref="grid"
          :columns="columns"
          :data-items="rows"
          has-filter
          :filter-fields="['name', 'bool', 'age']"
          :items-on-page="2"
          :row-css-class="(row: any) => [`aaa-${row['age']}`, 'bbb']"
          :extension-fields="['score']"
        ></HiveGrid>
      </widget-wrapper>
      <widget-wrapper title="TreeView">
        <hive-tree-view
          :nodes="treeNodes"
          checked-all
          checked-option="parent-checked-minus"
          :with-checkboxes="true"
          all-closed
        />
      </widget-wrapper>
      <widget-wrapper title="ContextMenu" style="height: 500px">
        <hive-context-menu :items="contextMenuItems" @context-item-click="universalLog" />
      </widget-wrapper>
    </div>
  </div>

  <notifications position="bottom center" />
</template>

<style lang="scss">
.name-grid {
  // background-color: red;
}

:root {
  // --bg-input: rgb(197, 105, 105);
}
</style>

<style scoped lang="scss">
@import '@/assets/variables.scss';
$bg-input: black;
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
  // background-color: aqua;
  z-index: 1;
}
</style>
