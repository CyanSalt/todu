<template>
  <div class="input-area">
    <textarea class="content" @change="update" v-model="content"></textarea>
    <div class="carriage">{{ content }}</div>
  </div>
</template>

<script>
export default {
  props: {
    text: String,
  },
  data() {
    return {
      content: this.text,
    }
  },
  methods: {
    update(e) {
      this.$emit('update:text', this.content)
    },
  }
}
</script>

<style>
.input-area {
  position: relative;
  word-break: break-all;
}
.input-area .carriage {
  visibility: hidden;
  white-space: pre-wrap;
  word-break: break-all;
}
.input-area .carriage::before,
.input-area .carriage::after {
  content: '';
  display: inline-block;
}
.input-area .content {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-appearance: none;
  padding: 0;
  border: none;
  font: inherit;
  color: inherit;
  background: transparent;
  outline: none;
  resize: none;
}
</style>
