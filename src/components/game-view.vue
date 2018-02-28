<template>
  <div :class="['game-view', color, {'shown': shown}]">
    <div class="head-info">
      <span class="score">
        <checkbox :checked="true" :solid="true"></checkbox>
        <span class="value">{{ score }}</span>
      </span>
      <span class="reset" @click="reset" ref="reset">
        <span class="icon-infinite"></span>
      </span>
      <span class="click">
        <checkbox :checked="false"></checkbox>
        <span class="value">{{ click }}</span>
      </span>
    </div>
    <div class="game-panel">
      <checkbox :class="['grid', {'disabled': disabled(index)}]" :solid="true"
        :checked="correct(index)" @click.native="check(index)"
        v-for="index in 100" :key="index"></checkbox>
    </div>
    <div class="game-history">
      <span :class="['record', record.color]"
        v-for="record in history">{{ record.detail }}</span>
    </div>
  </div>
</template>

<script>
import CheckBox from './checkbox'

export default {
  components: {
    'checkbox': CheckBox,
  },
  props: {
    entry: Number,
  },
  data() {
    return {
      score: 0,
      click: 0,
      color: this.theme(),
      target: this.random(100),
      detail: 0,
      floor: 0,
      ceil: 100,
      hit: false,
      history: [],
    }
  },
  computed: {
    shown() {
      return this.entry === 1
    }
  },
  methods: {
    random(limit) {
      return Math.floor(Math.random() * limit)
    },
    theme() {
      const colors = [
        'red', 'orange', 'yellow', 'green',
        'cyan', 'blue', 'purple', 'brown',
      ]
      const {length} = colors
      if (typeof this.color === 'undefined') {
        return colors[this.random(length)]
      }
      const index = colors.indexOf(this.color) + this.random(length - 2) + 1
      return colors[index >= length ? index - length : index]
    },
    reset() {
      this.color = this.theme()
      this.target = this.random(100)
      this.detail = 0
      this.floor = 0
      this.ceil = 100
      this.hit = false
      const circle = [
        {transform: 'rotate(0deg)'},
        {transform: 'rotate(180deg)'},
      ]
      this.$refs.reset.animate(circle, {
        easing: 'ease',
        duration: 200,
      })
    },
    correct(index) {
      return this.hit && this.target === index
    },
    disabled(index) {
      return index < this.floor || index > this.ceil
    },
    check(index) {
      if (this.hit || this.disabled(index)) {
        return
      }
      this.detail += 1
      this.click += 1
      if (index > this.target) {
        this.ceil = index - 1
      } else if (index < this.target) {
        this.floor = index + 1
      } else {
        this.floor = index
        this.ceil = index
        this.hit = true
        this.score += 1
        this.history.push({
          color: this.color,
          detail: this.detail,
        })
        this.history = this.history.slice(-10)
      }
    },
  }
}
</script>

<style>
.game-view {
  position: fixed;
  top: 28px;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(100%);
  transition: transform ease 0.3s;
  animation: slide ease 0.3s;
}
.game-view.shown {
  transition: transform ease 0.3s, backdrop-filter 0s 0.3s;
  transform: translateY(0);
  backdrop-filter: blur(2px);
}
@keyframes slide {
  from { transform: translateY(100%); backdrop-filter: none; }
  to { transform: translateY(0); backdrop-filter: none; }
}
.game-panel {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 320px;
}
.game-panel .grid {
  color: inherit;
  margin: 12px 6px 0 6px;
  transition: color ease 0.2s;
}
.game-panel .grid.disabled {
  color: #e3e3e3;
}
.score .pretty-checkbox {
  background: currentColor;
}
.head-info {
  display: flex;
  justify-content: space-around;
  width: 320px;
  height: 64px;
  line-height: 64px;
  transition: color ease 0.2s;
}
.head-info .pretty-checkbox {
  margin-top: 0;
  color: inherit;
  cursor: default;
}
.head-info .reset,
.head-info .value {
  display: inline-block;
  vertical-align: middle;
  font-size: 24px;
  color: inherit;
}
.head-info .reset {
  cursor: pointer;
}
.head-info .value {
  color: #343d46;
}
.game-history {
  width: 320px;
  font-size: 24px;
  height: 64px;
  line-height: 64px;
}
.game-history .record {
  display: inline-block;
  width: 32px;
  text-align: center;
}
.game-view.red,
.game-history .red {
  color: #ec5f67;
}
.game-view.orange,
.game-history .orange {
  color: #f99157;
}
.game-view.yellow,
.game-history .yellow {
  color: #fac863;
}
.game-view.green,
.game-history .green {
  color: #99c794;
}
.game-view.cyan,
.game-history .cyan {
  color: #5fb3b3;
}
.game-view.blue,
.game-history .blue {
  color: #6699cc;
}
.game-view.purple,
.game-history .purple {
  color: #c594c5;
}
.game-view.brown,
.game-history .brown {
  color: #ab7967;
}
</style>
