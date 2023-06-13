<template src="./filter-select.html"></template>
<script>
import { cloneDeep } from 'lodash';

export default {
  name: 'FilterSelect',
  model: {
    prop: 'value',
    event: 'change.value'
  },
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    source: {
      type: Array,
      required: true,
      default: function() {
        return [];
      }
    }
  },
  data() {
    const props = this.$props;
    const value = typeof props.value === 'undefined' ? null : props.value;
    return {
      mValue: value,
      mSource: []
    };
  },
  watch: {
    value(val) {
      this.mValue = val;
    },
    source(value) {
      this.mSource = value;
    }
  },
  methods: {
    mChange(value) {
      this.$emit('change.value', value);
      this.$emit('change', value);
    },
    mSearch(value) {
      if (value === null || value === '') {
        this.mSource = cloneDeep(this.source);
        return;
      }
      this.mSource = cloneDeep(this.source.filter(item =>
        item.value.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
        (item.inputCode ? item.inputCode.toLowerCase().indexOf(value.toLowerCase()) > -1 : false) ||
        (item.fullCode ? item.fullCode.toLowerCase().indexOf(value.toLowerCase()) > -1 : false))
      );
    },
    mVisible() {
      this.mSource = cloneDeep(this.source);
    }
  }
};
</script>
