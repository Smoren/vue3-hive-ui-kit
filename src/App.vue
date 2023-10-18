<script lang="ts" setup>
import { Ref, computed, onMounted, ref } from 'vue';
import WidgetWrapper from '@/WidgetWrapper.vue';
import { HiveButton, HiveDialog, HiveLoader, HiveTextarea } from '.';
import HiveInput from './components/hive-input/hive-input.vue';
import HiveDropDown from './components/hive-drop-down/hive-drop-down.vue';
import HiveRadioGroup from './components/hive-radio-group/hive-radio-group.vue';
import HiveCheckboxGroup from './components/hive-checkbox-group/hive-checkbox-group.vue';
import HiveCheckbox from './components/hive-checkbox/hive-checkbox.vue';
import HiveMultiselect from './components/hive-multiselect/hive-multiselect.vue';
import HiveBadge from './components/hive-badge/hive-badge.vue';
import hiveNotificationWrapper from './components/hive-notification/hive-notification-wrapper.vue';
import { Option } from './common/types/select';
import { useYearStore } from './stores/years';
import HiveUploadFile from '@/components/hive-upload-file/hive-upload-file.vue';
import { useNotification } from './components/hive-notification';
import HiveSplitter from './components/hive-splitter/hive-splitter.vue';
import HivePane from './components/hive-splitter/hive-pane.vue';
import HiveHtmlEditor from './components/hive-html-editor/hive-html-editor.vue';
import { v4 as uuidv4 } from 'uuid';
import HiveAutocomplete from './components/hive-autocomplete/hive-autocomplete.vue';
import HiveMultiautocomplete from './components/hive-multiautocomplete/hive-multiautocomplete.vue';
import HiveTabGroup from './components/hive-tab-group/hive-tab-group.vue';
import HiveTab from './components/hive-tab-group/hive-tab.vue';
import HiveListLoader from './components/hive-list-loader/hive-list-loader.vue';
import HiveSkeleton from './components/hive-skeleton/hive-skeleton.vue';

const text = ref('text');
const num = ref(0);
const isOpenModal = ref(false);
const dropdown = ref('74fd8aaa-e10a-4fd0-941b-6f6c7249003d');
const autocomplete = ref('');
const multiautocomplete = ref([]);
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

const options = [5, 2, 1, 4, 3, 6];

const textEditor = ref('');

let optionsTest: Option[] | undefined;

const autoCompleteOptions = ['bsh', 'asd', 'uip', 'lszv'];

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

const optionsObject = ref(null);

setTimeout(() => {
  // @ts-ignore
  optionsObject.value = {
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
}, 1000);

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
const checkName = 'Active'

const checkCurrent = {
  title: 'Activ',
  value: false,
}
const multiselect = ref(['74fd8aaa-e10a-4fd0-941b-6f6c7249003d']);

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

const log = (value: string) => {
  console.log(value);
};

const tab = ref('');
</script>

<template>
  <hive-loader :visible="false" />

  <div class="app">
    <div class="wrapper">
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
        <hive-button title="Classes" :class="'test'" @click="handleText" />
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

        <hive-input v-model="text" disabled />
        <hive-input v-model="num" type="number" />
        <hive-input v-model="num" type="number" :step="1" />
        <hive-input v-model="num" type="text" integer :min="5" :max="6" />
        <hive-input v-model="num" :mask="/^\d+$/" />
        <!-- <hive-input v-model="date" type="date" /> -->
        <hive-badge :counter="4" />
      </widget-wrapper>

      <!-- Modal -->
      <widget-wrapper title="Modal">
        <hive-button @click="isOpenModal = true" />

        <hive-dialog v-model="isOpenModal">
          <template #header>
            <!-- <hive-button title="close" /> -->
            ривэд эдвэд
            FFFFFFFFFFFFFddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
          </template>

          Hello

          <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px', height: '500px' }">
            <hive-input v-model="text" />
            <hive-multiselect :options="yearList" v-model="multiselect" title-field="title" value-field="value" />
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
        <hive-drop-down v-model="dropdown" :options="optionsObject" :style="{ width: '300px' }" value-field="id" />
        <hive-drop-down v-model="dd3" :options="optionsObjectSort" value-field="value" title-field="title" />
        <hive-drop-down v-model="dd3" :options="optionsObjectSort" title-field="titl" value-field="valu" />
        <hive-drop-down v-model="dd3" :options="yearList" title-field="title" value-field="value" with-null />
        <hive-drop-down v-model="dropdown" :options="options" />
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
        <hive-input type="radio" checked />
      </widget-wrapper>
      <widget-wrapper title="Checkbox">
        {{ checkbox }}
        <!-- <hive-checkbox-group
          :options="optionsObject ?? undefined"
          v-model="checkbox"
          title-field="title"
          value-field="classifier_id"
        /> -->
         <!-- <hive-checkbox-group :options="maritalStatusList" v-model="check" title-field="title" value-field="id" /> -->
        <hive-checkbox :option="checkName" v-model="check" />
      </widget-wrapper>
      <widget-wrapper title="Multiselect">
        {{ checkbox }}
        <hive-multiselect :options="yearList" v-model="multiselect" title-field="title" value-field="value" />
        <hive-textarea v-model="text" resize-direction="both" :style="{ width: '300px' }" disabled />
      </widget-wrapper>
      <widget-wrapper title="Autocompelte">
        {{ autocomplete }}
        <hive-autocomplete v-model="autocomplete" :options="autoCompleteOptions" :style="{ width: '300px' }" />
      </widget-wrapper>
      <widget-wrapper title="Multiautocompelte">
        {{ autocomplete }}
        <hive-multiautocomplete v-model="multiautocomplete" :options="autoCompleteOptions" :style="{ width: '300px' }" />
      </widget-wrapper>
      <widget-wrapper title="HiveUploadFile">
        <hive-upload-file />
      </widget-wrapper>
      <widget-wrapper title="Splitter" :class="{ 123: 1 }">
        <hive-splitter style="height: 700px">
          <hive-pane :id="uuidv4()">1</hive-pane>
          <hive-pane :id="uuidv4()">2</hive-pane>
          <hive-pane :id="uuidv4()">3</hive-pane>
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
        />
      </widget-wrapper>
      <widget-wrapper title="Multiautocompelte">
        {{ autocomplete }}
        <hive-tab-group v-model="tab">
          <hive-tab name="first" id="1">asd</hive-tab>
          <hive-tab name="second" id="2">cvb</hive-tab>
          <hive-tab name="third" id="3">fgh</hive-tab>
          <hive-tab name="fourth" id="4">ytiu</hive-tab>
        </hive-tab-group>
      </widget-wrapper>
      <widget-wrapper title="HtmlEditor" :class="{ 123: 1 }">
        {{ textEditor }}
        <hive-html-editor v-model="textEditor" />
      </widget-wrapper>
      <widget-wrapper title="ListLoader">
        <hive-list-loader :visible="true" />
      </widget-wrapper>
      <widget-wrapper title="Skeleton">
        <hive-skeleton :visible="true" />
      </widget-wrapper>
    </div>
  </div>
  <notifications position="bottom center" />
</template>

<style lang="scss" scoped>
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
