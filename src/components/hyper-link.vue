<template>
  <span class="hyper-link" @click.stop="skip">
    <span class="icon-link"></span>
  </span>
</template>

<script>
import {remote} from 'electron'

export default {
  name: 'hyper-link',
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
.list li .hyper-link {
  display: inline-block;
  width: 32px;
  text-align: center;
  color: #aaa;
  cursor: pointer;
  transition: color ease 0.2s;
}
.list li .hyper-link:hover {
  color: #2196f3;
}
</style>
