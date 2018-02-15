<template>
  <span class="hyperlink" @click.stop="skip">
    <span class="icon-link"></span>
  </span>
</template>

<script>
import {remote} from 'electron'

export default {
  props: {
    href: String,
  },
  methods: {
    skip() {
      remote.shell.openExternal(this.href)
    }
  }
}
</script>

<style>
.list li .hyperlink {
  display: inline-block;
  width: 32px;
  text-align: center;
  color: #aaa;
  cursor: pointer;
  transition: color ease 0.2s;
}
.list li .hyperlink:hover {
  color: #2196f3;
}
</style>
