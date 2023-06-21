export type IMaskValue = string | number | Date | RegExp | ((value: string) => boolean);

export interface IMask {
  mask: IMaskValue | IMaskValue[] | undefined;
  lazy?: boolean;
  min?: number;
  max?: number;
}
