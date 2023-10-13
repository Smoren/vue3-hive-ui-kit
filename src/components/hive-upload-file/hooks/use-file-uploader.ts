export async function uploadFile(file: File, url: String) {
  let formData = new FormData();
  //@ts-ignore

  formData.append("file", file.file);
  //@ts-ignore

  file.status = "loading";
  //@ts-ignore

  let response = await fetch(url, { method: "POST", body: formData });
  //@ts-ignore

  file.status = response.ok;

  return response;
}

export function uploadFiles(files: File[], url: string) {
  return Promise.all(files.map((file) => uploadFile(file, url)));
}

export default function createUploader(url: string) {
  return {
    uploadFile: function (file: File) {
      return uploadFile(file, url);
    },
    uploadFiles: function (files: File[]) {
      return uploadFiles(files, url);
    },
  };
}
