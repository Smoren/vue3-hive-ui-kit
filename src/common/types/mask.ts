export type MaskValue = string | number | Date | RegExp | ((value: string) => boolean);

export interface Mask {
  mask: MaskValue | MaskValue[] | undefined;
  lazy?: boolean;
  min?: number;
  max?: number;
}
