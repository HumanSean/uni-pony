<template>
  <div
    class="settings"
    :style="{ top: y + 'px', left: x + 'px' }"
  >
    <div class="header" @mousedown="move($event, 640, 480)">
      <svg
        class="icon app-icon back"
        aria-hidden="true"
        @click="back('settings')"
      >
        <use xlink:href="#icon-back"></use>
      </svg>
      <h2>偏好设定</h2>
    </div>
    <el-tabs type="border-card" tabPosition="left" style="height: 438px">
      <el-tab-pane label="用户管理">用户管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import subApp from "../../mixins/subApp";
export default {
  mixins: [subApp],
  data() {
    return {
      x: window.innerWidth / 2 - 320,
      y: window.innerHeight / 2 - 240,
    };
  },
  methods: {
    ...mapMutations([]),
  },
};
</script>

<style lang="scss" scoped>
.settings {
  position: absolute;
  width: 640px;
  height: 480px;
  border-radius: 3px;
  overflow: hidden;
  user-select: none;
}

.app-icon.back {
  width: 20px;
  height: 20px;
}

.header {
  & {
    height: 40px;
    cursor: move;
  }
  h2 {
    font-family: Microsoft YaHei;
    font-weight: normal;
    line-height: 40px;
    text-indent: 13px;
    font-size: 20px;
    color: #fff;
    background: #ccf3e2;
    letter-spacing: 3px;
  }
  svg {
    float: right;
    margin: 10px 13px 0 0;
  }
}
</style>