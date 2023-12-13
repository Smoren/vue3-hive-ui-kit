import { StyleValue } from 'vue';

export interface CommonProps {
  id?: string;
  attrs?: object;
  classes?: StyleValue;
  style?: Record<string, string>;
}
