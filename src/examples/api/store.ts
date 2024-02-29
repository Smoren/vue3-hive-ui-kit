import { type Ref, ref } from "vue";
import { defineStore } from "pinia";
import { http } from "@/examples/api/init";

export const useApiStore = defineStore("api", () => {
  const processCounter: Ref<number> = ref(0); // это реально полезно
  const lastErrorMessage: Ref<string | null> = ref(null); // а это просто демонстрация возможного использования
  const isLastRequestFailed: Ref<boolean> = ref(false); // и это тоже просто пример

  http.attachCounter(processCounter);
  http.onStart((config) => {
    console.log("REQUEST START", config);
  });
  http.onSuccess((response, config) => {
    isLastRequestFailed.value = true;
    console.log("REQUEST SUCCESS", config, response);
  });
  http.onError((response, config) => {
    lastErrorMessage.value = response.message;
    isLastRequestFailed.value = true;
    console.warn("REQUEST ERROR", config, response);
  });

  return {
    processCounter,
    lastErrorMessage,
    isLastRequestFailed,
  };
});
