import { type Ref, ref } from 'vue';

export interface InitialFiles {
  file: File;
}

export default function (initialFilesRef: Ref<InitialFiles[]>) {
  const files: Ref<UploadableFile[]> = ref([]);

  function addFiles(newFiles: File[]) {
    let newUploadableFiles = [...newFiles]
      .map((file) => new UploadableFile(file))
      .filter((file) => !fileExists(file.id));
    files.value = files.value.concat(newUploadableFiles);
    initialFilesRef.value.length = 0;
  }

  function fileExists(otherId: string) {
    //@ts-ignore
    return files.value.some(({ id }) => id === otherId);
  }

  function removeFile(file: File) {
    //@ts-ignore
    const index = files.value.indexOf(file);

    if (index > -1) files.value.splice(index, 1);

    if (initialFilesRef.value.length > 0) {
      initialFilesRef.value.length = 0;
    }
  }

  return { files, addFiles, removeFile };
}

class UploadableFile implements UploadableFile {
  constructor(file: File) {
    this.file = file;
    this.id = `${file.name}-${file.size}-${file.lastModified}-${file.type}`;
    this.url = URL.createObjectURL(file);
    this.status = null;
  }
  file: File;
  id: string;
  url: string;
  status: 'uploading' | 'done' | 'error' | null;
}

interface UploadableFile {
  file: File;
  id: string;
  url: string;
  status: 'uploading' | 'done' | 'error' | null;
}

export type { UploadableFile };
