import { Ref, ref } from 'vue';
import { defineStore } from 'pinia';

type Year = {
  // title: string;
  // value: number;
};

export const useYearStore = defineStore('years', () => {
  const years: Ref<Year[] | undefined> = ref();

  const getYears = async () => {
    setTimeout(() => {
      // years.value = [
      //   { title: '2023', value: 2023 },
      //   { title: '2021', value: 2021 },
      //   { title: '2024', value: 2024 },
      //   { title: '2022', value: 2022 },
      // ];
      years.value = [
        {
          user_name:
            '2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y 2023y ',
          user_id: 2023,
        },
        { user_name: '2021y', user_id: 2021 },
      ];
    }, 1000);
  };

  return { years, getYears };
});
