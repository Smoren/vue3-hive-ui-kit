declare module 'vue' {
  export interface GlobalComponents {
    HiveButton: typeof import('vue-hive-ui-kit')['HiveButton'];
    HiveLoader: typeof import('vue-hive-ui-kit')['HiveLoader'];
  }
}
