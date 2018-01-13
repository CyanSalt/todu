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
    text: String,
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
  vertical-align: middle;
  width: 32px;
  text-align: center;
  color: #aaa;
  transition: color ease 0.2s;
}
.list li .hyperlink:hover {
  color: #2196f3;
}
</style>
