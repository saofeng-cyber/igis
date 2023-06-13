<template src="./search-box.html"></template>
<script>
import PropTypes from './../vue-types';
export default {
  name: 'MsSearchBox',
  model: {
    prop: 'value',
    event: 'change.value'
  },
  props: {
    value: PropTypes.oneOfType([PropTypes.any, PropTypes.string, PropTypes.number, PropTypes.array]),
    defaultValue: PropTypes.oneOfType([PropTypes.any, PropTypes.string, PropTypes.number, PropTypes.array]),
    mode: {
      ...PropTypes.oneOf(['default', 'multiple']),
      default: 'default'
    },
    maxTagCount: {
      type: Number,
      default: Number.MAX_VALUE
    },
    maxTagHidden: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    search: {
      type: Boolean,
      default: true
    },
    clear: {
      type: Boolean,
      default: true
    },
    increase: {
      type: Boolean,
      default: false
    },
    notFoundContent: {
      ...PropTypes.any,
      default: '暂无数据'
    },
    highlight: {
      type: String,
      default: '#e6f7ff'
    },
    height: {
      type: Number,
      default: 300
    },
    placeholder: {
      ...PropTypes.any,
      default: '请输入检索内容'
    },
    size: {
      ...PropTypes.oneOf(['small', 'default', 'large']),
      default: 'default'
    },
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    async: {
      type: Boolean,
      default: true
    },
    /** 表格列索引 */
    rowKey: {
      type: String,
      default: 'key'
    },
    /** 键 */
    rowVal: {
      type: String,
      default: 'key'
    },
    /** 值 */
    rowName: {
      ...PropTypes.any,
      default: 'value'
    }
  },
  data() {
    const props = this.$props;
    return {
      stateValue: null,
      msPopoverVisible: false,
      msPlacement: null,
      msIndex: 0,
      tableData: props.async ? [] : props.data,
      msScroll: {
        x: true,
        y: this.height
      },
      msTime: null
    };
  },
  computed: {
    getColumns() {
      if (!this.increase) {
        return this.columns;
      }
      const size = this.columns.length;
      const renderContent = (value, row, index) => {
        const obj = {
          children: value,
          attrs: {}
        };
        if (index === 0) {
          obj.attrs.colSpan = 0;
        }
        return obj;
      };
      const columns = [];
      for (let i = 0; i < this.columns.length; i++) {
        if (i !== 0) {
          const _Columns = {
            ...this.columns[i],
            customRender: renderContent
          }
          columns.push(_Columns);
        }
      }
      return [
        {
          ...this.columns[0],
          customRender: (text, row, index) => {
            let obj = { children: text, attrs: {} }
            if (index === 0) {
              obj = {
                children:
                  this.$createElement('div', {
                    style: {
                      display: 'flex',
                      width: '100%'
                    }
                  }, [
                    this.$createElement('span', {
                      style: {
                        'text-align': 'left',
                        flex: 1
                      }
                    }, text),
                    this.$createElement('a-tag', {
                      props: {
                        color: 'red'
                      }
                    }, '新增')
                  ]),
                attrs: {
                  colSpan: size
                }
              }
            }
            return obj;
          }
        },
        ...columns
      ];
    }
  },
  watch: {
    value(val) {
      if (typeof val === 'undefined' || !val) {
        this.stateValue = null;
        return;
      }
      if (this.tableData.filter(item => item[this.rowVal] !== '-1').length === 0) {
        this.stateValue = this.defaultValue;
        return;
      }
      this.stateValue = this.TO_SELECT_FORMAT(val);
    },
    stateValue() {
      if (typeof this.stateValue === 'undefined' || !this.stateValue) {
        this.$emit('change.value', null);
        this.$emit('change', {
          value: null,
          record: null
        });
      }
    },
    data(val) {
      if (!this.async) {
        return;
      }
      if (!this.increase) {
        this.tableData = [...val];
        return;
      }
      this.tableData = [
        {
          [this.rowKey]: '-1',
          [this.rowVal]: '-1',
          [this.rowName]: this.stateValue === null ? '请输入检索名称' : this.stateValue.trim()
        },
        ...val
      ]
    },
    msIndex() {
      const affixheight = 38;
      let scrollTop = 0;
      if (this.msIndex !== 0 && this.msIndex !== -1) {
        if (affixheight * (this.msIndex + 1) - this.height > 0) {
          scrollTop = affixheight * (this.msIndex + 1) - this.height;
        }
        document.querySelector('.ms-popover .ant-table-body').scrollTop = scrollTop;
      }
    },
    msPopoverVisible() {
      if (this.msPopoverVisible) {
        window.addEventListener('keyup', this.msKeyDown);

        window.addEventListener('click', this.msClick);

        const x = this.$el.getBoundingClientRect().x;

        const width = this.$el.getBoundingClientRect().width;

        let contentWidth = 0;

        for (let i = 0; i < this.columns.length; i++) {
          contentWidth += this.getContent(this.columns[i].width);
        }

        setTimeout(() => {
          if (this.msPlacement.toUpperCase().indexOf('LEFT') !== -1) {
            return;
          }
          if (this.msPlacement.toUpperCase().indexOf('RIGHT') !== -1) {
            document.querySelector('.ms-popover').style.left = x + width - contentWidth - 15 + 'px';
            return;
          }
          document.querySelector('.ms-popover').style.left = x + width / 2 - contentWidth / 2 + 'px';
        }, 100);

        return;
      }
      this.destory();
    }
  },
  mounted() {
    this.compute();
  },
  methods: {
    blur() {
      this.$emit('blur');
    },
    focus() {
      this.$refs.msInput.focus();
    },
    pressEnter() {
      if (this.msPopoverVisible || this.stateValue === null) {
        return;
      }
      this.$emit('pressEnter');
    },
    TO_SELECT_FORMAT(value) {
      if (!value || value === null) {
        return null;
      }
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i][this.rowVal] === value) {
          return this.tableData[i][this.rowName];
        }
      }
    },
    getContent(width) {
      if (typeof width === 'number') {
        return Number(width);
      }
      return Number(width.split('px')[0]);
    },
    /** 动态计算位置 */
    compute() {
      const type = [];
      const x = this.$el.getBoundingClientRect().x;
      const y = this.$el.getBoundingClientRect().y;
      const width = this.$el.getBoundingClientRect().width;
      const innerHeight = window.innerHeight;
      const innerWidth = window.innerWidth;
      const fixedHeight = 46;
      let contentWidth = 0;
      const contentHeight = this.height;
      for (let i = 0; i < this.columns.length; i++) {
        contentWidth += this.getContent(this.columns[i].width);
      }
      if (innerHeight - y - contentHeight > 0) {
        type.push('bottom');
      } else {
        type.push('top');
      }
      if (contentWidth > width && (contentWidth - width) / 2 > x) {
        type.push('left');
      } else if (contentWidth > width && (contentWidth - width) / 2 > (innerWidth - x - width)) {
        type.push('right');
      }
      const toCamelCase = str => {
        const s = str &&
          str
            .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            .map(x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
            .join('');
        return s.slice(0, 1).toLowerCase() + s.slice(1);
      };
      this.msPlacement = toCamelCase(type.join(' '));
    },
    msKeyDown(e) {
      if (e.keyCode === 38) {
        if (this.msIndex > 0) {
          this.msIndex--;
        } else {
          this.msIndex = this.tableData.length - 1;
        }
      }
      if (e.keyCode === 40) {
        if (this.msIndex < this.tableData.length - 1) {
          this.msIndex++;
        } else {
          this.msIndex = 0;
        }
      }
      if (e.keyCode === 13) {
        this.msChangeValue();
        this.msPopoverVisible = false;
      }
    },
    msClick(e) {
      if (this.$el.contains(e.target)) {
        return;
      }
      this.msPopoverVisible = false;
      if (this.stateValue && String(this.stateValue).endsWith(' ')) {
        this.stateValue = this.stateValue.trim();
        return;
      }
      this.$emit('change.value', null);
      this.stateValue = null;
    },
    msChange(e) {
      if (!e.target.value) {
        this.msPopoverVisible = false;
        return;
      }
      this.msTime = new Date().getTime();
      setTimeout(() => {
        this.vSearch();
      }, 600);
    },
    vSearch() {
      if (new Date().getTime() - this.msTime < 600) {
        return;
      }
      this.msIndex = 0;
      this.msPopoverVisible = true;
      if (!this.async) {
        this.msSearch(this.stateValue);
        return;
      }
      this.$emit('search', this.stateValue);
    },
    msSearch(value) {
      let data = [...this.data];
      const search = value.trim();
      if (search !== '') {
        data = data.filter(item => {
          let flag = false;
          for (let k = 0; k < this.columns.length; k++) {
            flag =
              flag ||
              String(item[this.columns[k].dataIndex])
                .toLowerCase()
                .indexOf(search.toLowerCase()) > -1;
          }
          return flag;
        });
      }
      this.tableData = data;
    },
    msCustomRow(record, index) {
      return {
        style: {
          'background-color': index === this.msIndex ? `${this.highlight}` : '#FFF'
        },
        on: {
          click: (e) => {
            this.msIndex = index;
            this.msChangeValue();
            this.msPopoverVisible = false;
          }
        }
      };
    },
    msChangeValue() {
      if (this.tableData[this.msIndex][this.rowKey] === '-1') {
        this.$emit('increase', {
          key: '-1',
          value: this.stateValue.trim()
        });
        return;
      }
      if (this.mode === 'default') {
        this.$emit('change.value', this.tableData[this.msIndex][this.rowVal]);
        this.$emit('change', {
          value: this.tableData[this.msIndex][this.rowVal],
          record: this.tableData[this.msIndex]
        });
      }
    },
    destory() {
      window.removeEventListener('keyup', this.msKeyDown);

      window.removeEventListener('click', this.msClick);
    }
  }
};
</script>
<style lang="less" src="./search-box.less"></style>
