import DatePicker from './date-picker/date-picker.vue';
import MsFilterSelect from './filter-select/filter-select.vue';
import MsSearchBox from './search-box/search-box.vue';
import XKeyboard from '@/components/keyBorad.vue';

const components: any = {
  'date-picker': DatePicker,
  'ms-filter-select': MsFilterSelect,
  'ms-search-box': MsSearchBox,
  'x-keyboard': XKeyboard
};

export default {
  install(Vue: any) {
    Object.keys(components).forEach(key => {
      Vue.component(key, components[key]);
    });
  }
};
