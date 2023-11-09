import { CssClassConfig } from '../types';

export const getClassString = (row: Record<string, unknown>, cssClass?: CssClassConfig) => {
    if (cssClass === undefined || !cssClass) {
      return '';
    }
  
    if (typeof cssClass === 'function') {
      return cssClass(row);
    }
  
    if (Array.isArray(cssClass)) {
      return cssClass.join(' ');
    }
  
    return cssClass;
  };
  