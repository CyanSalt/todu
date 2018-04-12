<template>
  <span class="item-icon">
    <span class="icon-bookmark" v-if="pattern === 'bookmark'"></span>
    <span class="icon-cascade" v-else-if="pattern === 'cascade'"></span>
  </span>
</template>

<script>
export default {
  props: {
    pattern: String,
  },
}
</script>

<style>
.item-icon {
  display: inline-block;
  margin-right: 8px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
}
.item-icon .icon-bookmark {
  margin-left: -2px;
  font-size: 24px;
  color: #ed5e5e;
}
.item-icon .icon-cascade {
  position: relative;
}
.item-icon .icon-cascade::before {
  content: '';
  display: inline-block;
  width: 2px;
  height: 100%;
  vertical-align: top;
  border-radius: 1px;
  background: var(--theme-color, #28a386);
  opacity: 0.5;
}
.item-icon .icon-cascade::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: -8px;
  display: inline-block;
  height: 2px;
  margin-top: -1px;
  border-radius: 1px;
  background: var(--theme-color, #28a386);
  opacity: 0.5;
}
</style>
