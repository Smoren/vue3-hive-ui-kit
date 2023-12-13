<script setup lang="ts">
import { type Ref, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { CommonProps } from '@/common/types/props';
import {
  type Mount,
  type Unmount,
  type Focusout,
  type Focusin,
  type Change,
  onFocusin,
  onFocusout,
  type FileAdd,
  onFileAdd,
  type FileRemove,
  onFileRemove,
} from '@/common/mixin/emits';
import { useOnMount } from '@/common/hooks/use-mount';
import HiveUploadFileDropZone from './hive-upload-file-dropzone.vue';
import FilePreview from './file-preview.vue';
import useFileList, { type InitialFiles } from './hooks/use-file-list';

export interface Props extends CommonProps {
  id?: string;
  fileTypes?: string;
  title?: string;
  initialFiles?: string[] | null;
  multiple?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  id: uuidv4(),
  fileTypes: '',
  title: 'Нажмите сюда чтобы выбрать файлы или перетащите их',
  initialFiles: null,
  multiple: false,
});

type Emit = Mount & Unmount & Focusout & Focusin & Change<string> & FileAdd & FileRemove;
const emit = defineEmits<Emit>();
useOnMount(emit);

const initialFilesRef: Ref<InitialFiles[]> = ref([]);
if (props.initialFiles && props.initialFiles.length > 0) {
  for (const name of props.initialFiles) {
    initialFilesRef.value.push({
      file: new File(['foo'], name),
    });
  }
}

const { files, addFiles, removeFile } = useFileList(initialFilesRef);

const removeHandler = (file: File) => {
  removeFile(file);
  onFileRemove(emit);
};

const handleAdd = () => {
  onFileAdd(emit);
};

function onInputChange(e: Event) {
  if (e.target === null) return;
  addFiles((e.target as HTMLInputElement).files as unknown as File[]);
  handleAdd();
  //@ts-ignore
  e.target.value = null;
}

defineExpose({
  files,
});
</script>

<template>
  <div>
    <HiveUploadFileDropZone
      @files-dropped="addFiles($event), handleAdd()"
      #default="{ dropZoneActive }"
      class="uploader"
    >
      <label :for="id" v-if="initialFilesRef.length === 0 && files.length === 0" class="uploader-label">
        <span v-if="dropZoneActive" class="text-center">
          <span>Перетащите файлы</span>
          <span class="smaller">чтобы добавить их</span>
        </span>
        <span v-else class="text-center">
          {{ title }}
        </span>
        <input
          type="file"
          :id="id"
          @change="onInputChange"
          @focusin="onFocusin(emit)"
          @focusout="onFocusout(emit)"
          :accept="fileTypes !== ' ' ? fileTypes : '*'"
          :multiple="multiple"
        />
      </label>
      <ul class="image-list" v-show="files.length !== 0 || initialFilesRef.length !== 0">
        <FilePreview
          v-if="files.length"
          v-for="file of files"
          :key="(file as any).id"
          :file="file"
          tag="li"
          @remove="removeHandler"
        />
        <FilePreview
          v-else-if="initialFilesRef.length"
          v-for="file of initialFilesRef"
          :file="file"
          tag="li"
          @remove="removeHandler"
        />
      </ul>
    </HiveUploadFileDropZone>
  </div>
</template>

<style scoped lang="scss">
.drop-area {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 50px;
  background: #ffffff55;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: 0.2s ease;

  &[data-active='true'] {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    background: #ffffffcc;
  }
}

.uploader {
  border: 2px solid rgb(223, 229, 255);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: rgb(248, 252, 255);
}

label {
  font-size: 24px;
  cursor: pointer;
  display: block;
  width: 100%;
  height: 100%;
  padding: 10px;

  span {
    display: block;
  }

  input[type='file']:not(:focus-visible) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
    top: 0;
  }

  .smaller {
    font-size: 14px;
  }
}

.image-list {
  width: 100%;
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  padding: 0;
  gap: 10px;
}

.upload-button {
  display: block;
  appearance: none;
  border: 0;
  border-radius: 50px;
  padding: 0.75rem 3rem;
  margin: 1rem auto;
  font-size: 1.25rem;
  font-weight: bold;
  background: #369;
  color: #fff;
  text-transform: uppercase;
}

.text-center {
  text-align: center;
  font-size: 16px;
}
</style>
