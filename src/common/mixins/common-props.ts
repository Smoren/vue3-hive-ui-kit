import { v4 as uuidv4 } from "uuid";

const commonProps = {
  id: {
    type: [String],
    required: false,
    default: (): string => `hive-id-${uuidv4()}`,
  },
  attrs: {
    type: [Object],
    required: false,
  },
  classes: {
    type: [Array, Object],
    required: false,
  },
  style: {
    type: [Object],
    required: false,
  },
};

export interface commonProps1 {
  id?: string;
  attrs?: object;
  classes?: object[];
  style?: object[];
}

export default commonProps;
