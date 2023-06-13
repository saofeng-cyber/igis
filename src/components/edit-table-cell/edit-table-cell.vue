<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-input type="textarea" :value="value" @input="handleChange" @pressEnter="check" /><a-icon
        type="check"
        class="editable-cell-icon-check"
        @click="check"
      />
    </div>
    <div v-else class="editable-cell-text-wrapper">
        {{ value || ' ' }}
        <a-icon type="edit" class="editable-cell-icon" @click="edit" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
@Component
export default class EditableCell extends Vue {
  @Prop() text!: string
  editable: boolean = false
  value:string = this.text
  @Watch('text')
  updateValue() {
    this.value = this.text
  }

  handleChange(e: any) {
    const value = e.target.value;
    this.value = value;
  }

  check() {
    this.editable = false;
    this.$emit('change', this.value);
  }

  edit() {
    this.editable = true;
  }
}
</script>

<style scoped>
.editable-cell {
  position: relative;
}
.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}
.editable-cell-text-wrapper {
  padding: 5px 5px 5px 5px;
  /* max-width: 100px; */
}
.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}
.editable-cell-icon {
  line-height: 18px;
  display: none;
}
.editable-cell-icon-check {
  line-height: 28px;
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}
</style>
