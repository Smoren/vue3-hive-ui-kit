<script setup lang="ts">
import { defineComponent, PropType, Ref, ref } from 'vue';
import HiveUploadFileDropZone from './HiveUploadFileDropZone.vue';
import FilePreview from './FilePreview.vue';
import useFileList, { IinitialFiles } from './hooks/use-file-list';

export interface Props extends CommonProps {
  options: Options | undefined;
  modelValue: Value;
  inline?: boolean;
  titleField?: string;
  valueField?: string;
  name?: string;
}

const props = withDefaults(defineProps<Props>(), {
  inline: false,
  titleField: 'title',
  valueField: 'value',
  name: 'radio-group',
});

export default defineComponent({
  name: 'HiveUploadFile',
  props: {
    fileTypes: {
      type: String,
      default: '',
    },
    modelValueEventName: {
      type: String,
      default: 'input',
    },
    title: {
      type: String,
      default: 'Нажмите сюда чтобы выбрать файлы или перетащите их',
    },
    initialFiles: {
      type: Object as PropType<string[] | null>,
      default: [],
    },
  },
  components: { HiveUploadFileDropZone, FilePreview },
  setup(props, context) {
    const initialFilesRef: Ref<IinitialFiles[]> = ref([]);
    if (props.initialFiles && props.initialFiles.length > 0) {
      for (const name of props.initialFiles) {
        initialFilesRef.value.push(
          //@ts-ignore
          {
            file: new File(['foo'], name),
          },
        );
      }
    }

    const { files, addFiles, removeFile } = useFileList(initialFilesRef);

    const removeHandler = (file: File) => {
      removeFile(file);
      // handleEvent(new Event('onRemove'));
    };

    const handleAdd = () => {
      // handleEvent(new Event('onAddFiles'));
    };

    function onInputChange(e: Event) {
      if (e.target === null) return;
      //@ts-ignore
      addFiles((e.target as HTMLInputElement).files as File[]);
      handleAdd();
      //@ts-ignore
      e.target.value = null;
    }

    return {
      removeFile,
      files,
      onInputChange,
      addFiles,
      initialFilesRef,
      removeHandler,
      handleAdd,
    };
  },
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
        <input type="file" :id="id" @change="onInputChange" :accept="fileTypes !== ' ' ? fileTypes : '*'" />
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

<style lang="scss" scoped>
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
