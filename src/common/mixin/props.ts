import { StyleValue } from 'vue';

export interface CommonProps {
  id?: string;
  attrs?: object;
  classes?: object[];
  style?: StyleValue;
}
