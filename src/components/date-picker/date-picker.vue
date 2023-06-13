<template src="./date-picker.html"></template>
<script>
import { TimeType } from '../vue-types/moment-util.js';
import PropTypes from '../vue-types/index.js';
import { DateType } from '@/utils/index';
import { datePickerFocus } from '@/utils/datePickerFocus';

export default {
  name: 'DatePicker',
  model: {
    prop: 'value',
    event: 'change.value'
  },
  props: {
    value: TimeType,
    format: {
      ...PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.func]),
      default: DateType.DATE
    },
    valueFormat: {
      ...PropTypes.string,
      default: DateType.DATE
    },
    dropdownClass: {
      ...PropTypes.string,
      default: 'dropdownPicker'
    }
  },
  data() {
    const props = this.$props;
    return {
      mValue: props.value,
      mFormat: props.format,
      mValueFormat: props.valueFormat,
      mOpen: false
    }
  },
  watch: {
    value(val) {
      this.mValue = val;
    }
  },
  methods: {
    handleChange(date, dateString) {
      this.$emit('change.value', date);
      this.$emit('change', date, dateString);
    },
    handleClick() {
      if (this.mFormat === this.format) {
        this.mOpen = false;
      } else {
        this.mOpen = true;
      }
    },
    handleOpenChange(_open) {
      if (_open) {
        this.mFormat = 'YYYYMMDD';
        datePickerFocus('.' + this.dropdownClass);
        return;
      }
      this.mFormat = this.format;
      this.mOpen = false;
      this.$refs.datePicker.focus();
    },
    handleKeydown(e) {
      switch (e.keyCode) {
        case 13:
          this.mOpen = false;
          this.mFormat = this.format;
          break;
        case 40:
          this.mOpen = true;
      }
      this.$emit('keydown', e);
    },
    focus() {
      this.$refs.datePicker.focus();
    }
  }
}
</script>
