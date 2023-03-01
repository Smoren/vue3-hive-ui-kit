<script lang="ts" setup>
import HiveTextarea from "@hive/components/hive-textarea/HiveTextarea.vue";
import HiveAutocomplete from "@hive/components/hive-autocomplete/HiveAutocomplete.vue";
import HiveCheckboxGroup from "@hive/components/hive-checkbox-group/HiveCheckboxGroup.vue";
import HiveComponent from "@hive/components/hive-component/HiveComponent.vue";
import HiveDropDownList from "@hive/components/hive-drop-down-list/HiveDropDownList.vue";
import HiveGrid from "@hive/components/hive-grid/HiveGrid.vue";
import type { GridColumns } from "@hive/components/hive-grid/hooks/use-hive-grid";
import HiveInputDate from "@hive/components/hive-input-date/HiveInputDate.vue";
import HiveInputDateRange from "@hive/components/hive-input-date-range/HiveInputDateRange.vue";
import HiveInputDateTime from "@hive/components/hive-input-datetime/HiveInputDateTime.vue";
import HiveInputDateTimeRange from "@hive/components/hive-input-datetime-range/HiveInputDateTimeRange.vue";
import HiveInputNumber from "@hive/components/hive-input-number/HiveInputNumber.vue";
import HiveInputText from "@hive/components/hive-input-text/HiveInputText.vue";
import HiveInputTime from "@hive/components/hive-input-time/HiveInputTime.vue";
import HiveInputTimeRange from "@hive/components/hive-input-time-range/HiveInputTimeRange.vue";
import HiveLoader from "@hive/components/hive-loader/HiveLoader.vue";
import HiveMarquee from "@hive/components/hive-marquee/HiveMarquee.vue";
import HiveModal from "@hive/components/hive-modal/HiveModal.vue";
import HiveMultiAutocomplete from "@hive/components/hive-multiautocomplete/HiveMultiautocomplete.vue";
import HiveMultiselect from "@hive/components/hive-multiselect/HiveMultiselect.vue";
import HiveMultiselectableList from "@hive/components/hive-multiselectable-list/HiveMultiselectableList.vue";
import HiveObservable from "@hive/components/hive-observable/HiveObservable.vue";
import HivePicker from "@hive/components/hive-picker/HivePicker.vue";
import HivePopup from "@hive/components/hive-popup/HivePopup.vue";
import HiveRadioGroup from "@hive/components/hive-radio-group/HiveRadioGroup.vue";
import HiveSelectableList from "@hive/components/hive-selectable-list/HiveSelectableList.vue";
import HiveSplitter from "@hive/components/hive-splitter/HiveSplitter.vue";
import HiveTabGroup from "@hive/components/hive-tab-group/HiveTabGroup.vue";
import HiveTab from "@hive/components/hive-tab-group/HiveTab.vue";
import HivePane from "@hive/components/hive-splitter/HivePane.vue";
import WidgetItem from "@hive/WidgetItem.vue";
import { reactive, Ref, ref, watch, defineAsyncComponent } from "vue";
import { EventData } from "@hive/common/hooks/base/use-event-handler";
import HiveButton from "@hive/components/hive-button/HiveButton.vue";
import { v4 as uuidv4 } from "uuid";
import HiveTreeView from "@hive/components/hive-tree-view/HiveTreeView.vue";
import { TreeView } from "@hive/components/hive-tree-view/hive-tree-view-type";

const isShown = ref(false);
const textarea = ref("");
const autocomplete = ref("");
const multiautomplete = ref([]);
const checkbox = ref([]);
const dropdown = ref("");
const date = ref(new Date().getTime());
const datetime = ref(new Date().getTime());
const datetimerange = ref([new Date().getTime(), new Date().getTime()]);
const daterange = ref([new Date().getTime(), new Date().getTime()]);
const number = ref(1);
const text = ref("");
const time = ref("");
const timerange = ref("");
const multiselect = ref([]);
const multiselectable = ref([]);
const radiogroup = ref("");
const selectable = ref("");
const tabgroup = ref("");

const logEvent = (event: EventData) => {
  console.log(event);
  // if (event.type === "keydown") {
  //   event.data.prevent();
  // }
};

const hive = defineAsyncComponent({
  loader: () => import("@hive/components/hive-grid/HiveGrid.vue"),
  loadingComponent: HiveLoader,
  delay: 200,
});

const tree: TreeView[] = [
  {
    name: "1",
    children: [],
    img: "https://picsum.photos/200",
  },
  {
    name: "2",
    children: [
      {
        name: "3",
        children: [],
      },
      {
        name: "4",
        children: [],
      },
      {
        name: "5",
        children: [],
      },
      {
        name: "6",
        children: [],
      },
    ],
  },
  {
    name: "7",
    children: [
      {
        name: "8",
        children: [],
      },
      {
        name: "9",
        children: [],
      },
      {
        name: "10",
        children: [],
      },
      {
        name: "11",
        children: [
          {
            name: "12",
            children: [],
          },
          {
            name: "13",
            children: [],
          },
          {
            name: "14",
            children: [],
          },
          {
            name: "15",
            children: [],
          },
          {
            name: "16",
            children: [],
          },
        ],
      },
    ],
  },
  {
    name: "17",
    children: [],
  },
  {
    name: "18",
    children: [],
  },
  {
    name: "19",
    children: [],
  },
];

const columns: GridColumns[] = [
  {
    field: "full_name",
    title: "Полное имя",
    editType: "text",
  },
  {
    field: "job_title",
    title: "Должность",
    editType: "text",
  },
  {
    field: "phone",
    title: "Номер телефона",
    editType: "text",
  },
  {
    field: "budget",
    title: "Бюджет",
    sortable: true,
    sort: (a, b) => (b > a ? 1 : b < a ? -1 : 0),
    editType: "number",
  },
  {
    field: "array",
    title: "Массив",
    viewType: "list",
    separator: ", ",
    editType: "multiselect",
  },
  {
    field: "gender",
    title: "Пол",
    viewType: "list",
    editType: "multiselect",
    options: ["M", "F"],
  },
  {
    field: "date_birth",
    title: "Дата",
    editType: "date-range",
  },
];

const employees: unknown[] = reactive([]);

//@ts-ignore
for (let i = 0; i < 1000; i++) {
  employees.push({
    id: `${uuidv4()}`,
    full_name: `${i}`,
    job_title: "Human Resources Assistant III",
    country: "US",
    is_online: true,
    rating: 3,
    target: 100,
    budget: 47601,
    phone: "(936) 9429601",
    address: "138 Buhler Avenue",
    img_id: 1,
    gender: ["M"],
    array: ["1", "2", "3"],
    date_birth: null,
  });
}

const onChange = (
  event: EventData,
  handleChange: (value: EventData["value"]) => void,
  handleToggle: () => void
) => {
  if (event.type === "focusout") {
    handleChange(event.value);
    handleToggle();
  }
};

// setTimeout(() => {
//   employees[0].full_name = '112'
// }, 10000)
</script>

<template>
  <div class="list">
    <widget-item title="TreeView">
      <hive-tree-view :nodes="tree" @event="logEvent"/>
    </widget-item>

    <widget-item title="Button">
      <HiveButton @event="logEvent" />
    </widget-item>
    <h1>All widgets</h1>
    <widget-item title="Textarea">
      <hive-textarea @event="logEvent" />
      <hive-textarea
        placeholder="Text area with two rows"
        :rowsCount="2"
        v-model="textarea"
        @event="logEvent"
      />
      <hive-textarea
        v-model="textarea"
        placeholder="Text area with 5"
        :rowsCount="5"
        label="Textarea"
        @event="logEvent"
      />
    </widget-item>
    <widget-item title="Autocomplete">
      <hive-autocomplete
        :options="['First', 'Second', 'First1', 'Second1']"
        @event="logEvent"
      />
      <hive-autocomplete
        :options="[
          { home: 'home', f: 'first' },
          { home: 'hame', f: 'second' },
        ]"
        placeholder="objects"
        value-field="f"
        title-field="f"
        @event="logEvent"
      />
      <hive-autocomplete
        :options="[
          { home: 'home', f: 'first' },
          { home: 'hame', f: 'second' },
          'hello',
          'hello',
          'hell`o',
          'hello1',
          'hello2',
          'hello3',
          'hello',
          'h3ello',
          'he4llo',
          'hel5lo',
          'hell5o',
          'hello5',
          'hell5o',
          'hello6',
          'hello51',
          'hello52',
          'hello53',
          'hello531',
          'hello5312',
        ]"
        v-model="autocomplete"
        placeholder="objects and string"
        value-field="home"
        title-field="f"
        :min-query-length="2"
        :max-elements="5"
        @event="logEvent"
      />
      <hive-multi-autocomplete
        :options="[
          'hello',
          'hello',
          'hell`o',
          'hello1',
          'hello2',
          'hello3',
          'hello',
          'h3ello',
          'he4llo',
          'hel5lo',
          'hell5o',
          'hello5',
          'hell5o',
          'hello6',
          'hello51',
          'hello52',
          'hello53',
          'hello531',
          'hello5312',
        ]"
        v-model="multiautomplete"
        placeholder="multiple autocomplete"
        :only-distinct-values="true"
        @event="logEvent"
      />
    </widget-item>
    <widget-item title="Checkbox group">
      <hive-checkbox-group
        v-model="checkbox"
        :options="['First', 'Second']"
        group-label="options array"
        @event="logEvent"
      />
      <hive-checkbox-group
        :options="{ home: 'hame', f: 'second' }"
        group-label="options object"
        :inline="true"
        v-model="checkbox"
        @event="logEvent"
      />
    </widget-item>
    <widget-item title="Dropdown">
      <hive-drop-down-list
        :options="[
          'First',
          'Second',
          'hello',
          'hello',
          'hell`o',
          'hello1',
          'hello2',
          'hello3',
          'hello',
          'h3ello',
          'he4llo',
          'hel5lo',
          'hell5o',
          'hello5',
          'hell5o',
          'hello6',
          'hello8',
        ]"
        @event="logEvent"
      />
      <hive-drop-down-list
        :options="[
          'First',
          'Second',
          'hello',
          'hell5o',
          'hell1o',
          'hello1',
          'hello2',
          'hello3',
          'h3ello',
          'he4llo',
          'hel5lo',
          'hello5',
          'hello6',
          'hello8',
        ]"
        border-color-on-focus="red"
        v-model="dropdown"
        @event="logEvent"
      />
    </widget-item>
    <!-- <widget-item title="Grid">
      <hive
        :columns="columns"
        :data-items="employees"
        @event="logEvent"
        :items-on-page="10"
      >
        <template #full_name="{ item }">
          <div class="foo">
            <img v-if="item.url" class="fit-picture" :src="item.url" />
            {{ item.name ?? item }}
          </div>
        </template>
        <template #full_name-edit="{ value, update, isChangeAllowed }">
          <HiveInputText
            @click.stop
            :model-value="value"
            @input="update"
            :is-invalid="!isChangeAllowed"
          />
        </template>
        <template
          #array-edit="{ value, update, isChangeAllowed, toggle, customChange }"
        >
          <hive-multiselect
            :model-value="value"
            @event="(event) => onChange(event, customChange, toggle)"
            :options="[
              'First',
              'Second',
              'First',
              'Second',
              'hello',
              'hello',
              'hell`o',
              'hello1',
              'hello2',
              'hello3',
              'hello',
              'h3ello',
              'he4llo',
              'hel5lo',
              'hell5o',
              'hello5',
              'hell5o',
              'hello6',
              'hello8',
            ]"
          />
        </template>
        <template #phone="{ item }">
          <div>+7 {{ item }}</div>
        </template>
        <template #budget-edit="{ value, update, isChangeAllowed }">
          <HiveInputNumber
            @click.stop
            :model-value="value"
            @input="update"
            :is-invalid="!isChangeAllowed"
          />
        </template>
      </hive>
    </widget-item> -->
    <!--     <widget-item title="Loader" style="display: flex; align-items: center">
      <HiveLoader />
    </widget-item> -->
    <widget-item title="InputDate">
      <div>
        <hive-input-date
          @event="logEvent"
          v-model="date"
          :with-timezone="true"
        />
      </div>
      <hive-input-date
        :min-date="new Date(2022, 10, 10).getTime()"
        @event="logEvent"
      />

      <hive-input-date
        :min-date="new Date(2022, 10, 10).getTime()"
        :max-date="new Date(2023, 2, 2).getTime()"
        @event="logEvent"
      />
    </widget-item>
    <!-- <widget-item title="UploadFile">
      <hive-upload-file />
    </widget-item>  -->
    <widget-item title="InputDateRange">
      <hive-input-date-range @event="logEvent" />
      <hive-input-date-range @event="logEvent" />
      <hive-input-date-range
        :min-date="new Date(2022, 1, 10).getTime()"
        :max-date="new Date(2023, 2, 2).getTime()"
        v-model="daterange"
        @event="logEvent"
      />
    </widget-item>
    <widget-item title="InputDateTime">
      <hive-input-date-time @event="logEvent" />
      <hive-input-date-time
        :with-seconds="true"
        :hour-step="4"
        @event="logEvent"
      />
      <hive-input-date-time v-model="datetime" @event="logEvent" />
    </widget-item>
    <widget-item title="InputDateTimeRange">
      <hive-input-date-time-range v-model="datetimerange" @event="logEvent" />
    </widget-item>
    <widget-item title="InputNumber">
      <hive-input-number
        :id="'1'"
        :attrs="{ key: 10 }"
        v-model="number"
        @event="logEvent"
      />
    </widget-item>
    <widget-item title="InputText">
      <hive-input-text maska="##.##.####" v-model="text" @event="logEvent" />
    </widget-item>
    <widget-item title="InputTime">
      <hive-input-time v-model="time" @event="logEvent" />
    </widget-item>
    <widget-item title="InputTimeRange">
      <hive-input-time-range v-model="timerange" @event="logEvent" />
    </widget-item>
    <widget-item title="Multiselect">
      <hive-multiselect
        :options="[
          'First',
          'Second',
          'First',
          'Second',
          'hello',
          'hello',
          'hell`o',
          'hello1',
          'hello2',
          'hello3',
          'hello',
          'h3ello',
          'he4llo',
          'hel5lo',
          'hell5o',
          'hello5',
          'hell5o',
          'hello6',
          'hello8',
        ]"
        v-model="multiselect"
        @event="logEvent"
      />
    </widget-item>
    <widget-item title="MultiselectableList">
      <hive-multiselectable-list
        :options="['First', 'Second', 'hell5o', 'hello5', 'hello6', 'hello8']"
        v-model="multiselectable"
        @event="logEvent"
      />
    </widget-item>
    <widget-item title="RadioGroup">
      <hive-radio-group
        :options="['First', 'Second']"
        v-model="radiogroup"
        @event="logEvent"
      />
    </widget-item>
    <widget-item title="SelectbleList">
      <hive-selectable-list
        :options="[
          'First',
          'Second',
          'hello',
          'h3ello',
          'he4llo',
          'hel5lo',
          'hell5o',
          'hello5',
          'hello6',
          'hello8',
        ]"
        v-model="selectable"
        @event="logEvent"
      />
    </widget-item>
    <widget-item title="TabGroup">
      <hive-tab-group v-model="tabgroup" @event="logEvent">
        <hive-tab name="Таб первый" id="1">
          <div>sdasd</div>
          <template v-slot:tab> aaaaaaaaa </template>
        </hive-tab>
        <hive-tab name="Привет мир" id="2">
          <div>sda</div>
        </hive-tab>
        <hive-tab name="3" id="3">
          <div>sdfasd</div>
        </hive-tab>
        <hive-tab name="4" id="4">
          <div>sdasd</div>
        </hive-tab>
        <hive-tab name="5" id="5">
          <div>sdasd</div>
        </hive-tab>
        <div>Hello</div>
      </hive-tab-group>
    </widget-item>
    <widget-item title="" class="item splitter">
      <hive-splitter @event="logEvent">
        <hive-pane :size="'100'"> 111 </hive-pane>
        <hive-pane>
          <hive-splitter :horizontal="true" @event="logEvent">
            <hive-pane :min-size="30"> 222 </hive-pane>
            <hive-pane> 333 </hive-pane>
          </hive-splitter>
        </hive-pane>
      </hive-splitter>
    </widget-item>
  </div>
</template>

<style scoped lang="scss">
.list {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .modal {
    width: 100%;
    height: 500px;
  }
}
hive-tab {
  width: 50px;
}

.color {
  height: 100px;
}
.splitter {
  height: 1000px;
}

.foo {
  display: flex;
  align-items: center;
  gap: 10px;
  .fit-picture {
    height: 40px;
  }
}
</style>
