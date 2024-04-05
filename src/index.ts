import HiveAutocomplete from '@/components/hive-autocomplete/hive-autocomplete.vue';
import HiveBadge from '@/components/hive-badge/hive-badge.vue';
import HiveButton from '@/components/hive-button/hive-button.vue';
import HiveCheckbox from '@/components/hive-checkbox/hive-checkbox.vue';
import HiveCheckboxGroup from '@/components/hive-checkbox-group/hive-checkbox-group.vue';
import HiveDialog from '@/components/hive-dialog/hive-dialog.vue';
import HiveDropDown from '@/components/hive-drop-down/hive-drop-down.vue';
import HiveGrid from '@/components/hive-grid/hive-grid.vue';
import HiveGridRow from '@/components/hive-grid/hive-grid-row.vue';
import HiveHtmlEditor from '@/components/hive-html-editor/hive-html-editor.vue';
import HiveInput from '@/components/hive-input/hive-input.vue';
import HiveInputSearch from '@/components/hive-input-search/hive-input-search.vue';
import HiveListLoader from '@/components/hive-list-loader/hive-list-loader.vue';
import HiveLoader from '@/components/hive-loader/hive-loader.vue';
import HiveMultiautocomplete from '@/components/hive-multiautocomplete/hive-multiautocomplete.vue';
import HiveMultiselect from '@/components/hive-multiselect/hive-multiselect.vue';
import HivePane from './components/hive-splitter/hive-pane.vue';
import HiveRadioGroup from '@/components/hive-radio-group/hive-radio-group.vue';
import HiveSkeleton from '@/components/hive-skeleton/hive-skeleton.vue';
import HiveSplitter from '@/components/hive-splitter/hive-splitter.vue';
import HiveTabGroup from '@/components/hive-tab-group/hive-tab-group.vue';
import HiveTab from '@/components/hive-tab-group/hive-tab.vue';
import HiveTextarea from '@/components/hive-textarea/hive-textarea.vue';
import HiveTreeView from './components/hive-tree-view/hive-tree-view.vue';
import HiveTreeViewNode from './components/hive-tree-view/hive-tree-view-node.vue';
import HiveUploadFile from '@/components/hive-upload-file/hive-upload-file.vue';
import Notification from '@/plugins/hive-notification';
import { notify, useNotification } from '@/plugins/hive-notification';

import type { NotificationsOptions, NotificationsPluginOptions, NotificationItem } from '@/plugins/hive-notification';
import type { VueComponent, Value } from '@/common/types/value';
import type { UploadableFile } from '@/components/hive-upload-file/hooks/use-file-list';
import type { GridColumns } from '@/components/hive-grid/types';
import type { TreeView, TreeViewImg, ChoosenNode, TreeImg } from '@/components/hive-tree-view/hive-tree-view-type';
import type { HiveUploadFilesType } from './components/hive-upload-file/hive-upload-file-type';

import '@/assets/variables.scss';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/* import specific icons */
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';

export {
  HiveAutocomplete,
  HiveBadge,
  HiveButton,
  HiveDialog,
  HiveDropDown,
  HiveGrid,
  HiveGridRow,
  HiveHtmlEditor,
  HiveInput,
  HiveInputSearch,
  HiveListLoader,
  HiveLoader,
  HiveMultiautocomplete,
  HivePane,
  HiveMultiselect,
  HiveRadioGroup,
  HiveCheckbox,
  HiveCheckboxGroup,
  HiveSkeleton,
  HiveSplitter,
  HiveTabGroup,
  HiveTab,
  HiveTextarea,
  HiveTreeView,
  HiveTreeViewNode,
  HiveUploadFile,
  Notification,
  notify,
  useNotification,
  library,
  FontAwesomeIcon,
  faSearch,
  faXmark,
};

export type {
  NotificationsOptions,
  NotificationsPluginOptions,
  NotificationItem,
  VueComponent,
  Value,
  UploadableFile,
  GridColumns,
  TreeView,
  TreeViewImg,
  ChoosenNode,
  TreeImg,
  HiveUploadFilesType,
};
