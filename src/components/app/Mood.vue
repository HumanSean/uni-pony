<template>
  <div
    class="mood"
    :style="{ top: y + 'px', left: x + 'px' }"
  >
    <div class="header" @mousedown="move($event, 300, 480)">
      <svg
        class="icon app-icon back"
        aria-hidden="true"
        @click="back('mood')"
      >
        <use xlink:href="#icon-back"></use>
      </svg>
      <h2>此刻心情</h2>
    </div>
    <el-table :data="moods" border style="width: 100%" height="440">
      <el-table-column
        :resizable="false"
        align="center"
        prop="type"
        label="心情"
      >
      </el-table-column>
      <el-table-column
        :resizable="false"
        align="center"
        label="一般"
        width="70"
      >
        <template slot-scope="scope">
          <svg
            class="icon app-icon"
            aria-hidden="true"
            @click="setMood(scope.row.normal)"
          >
            <use :xlink:href="`#icon-${scope.row.normal}`"></use>
          </svg>
        </template>
      </el-table-column>
      <el-table-column
        :resizable="false"
        align="center"
        prop="plenty"
        label="很多"
        width="70"
      >
        <template slot-scope="scope">
          <svg
            class="icon app-icon"
            aria-hidden="true"
            @click="setMood(scope.row.plenty)"
          >
            <use :xlink:href="`#icon-${scope.row.plenty}`"></use>
          </svg>
        </template>
      </el-table-column>
      <el-table-column
        :resizable="false"
        align="center"
        prop="extreme"
        label="极度"
        width="70"
      >
        <template slot-scope="scope">
          <svg
            class="icon app-icon"
            aria-hidden="true"
            @click="setMood(scope.row.extreme)"
          >
            <use :xlink:href="`#icon-${scope.row.extreme}`"></use>
          </svg>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import subApp from "../../mixins/subApp";
export default {
  mixins: [subApp],
  data() {
    return {
      x: window.innerWidth / 2 - 150,
      y: window.innerHeight / 2 - 240,
      moods: [
        {
          type: "开心",
          normal: "xiaolian",
          plenty: "kaixin",
          extreme: "daxiao",
        },
        {
          type: "沮丧",
          normal: "nanguo",
          plenty: "liulei",
          extreme: "siliao",
        },
        {
          type: "震惊",
          normal: "fadai",
          plenty: "jingya",
          extreme: "a",
        },
        {
          type: "生气",
          normal: "shengqi",
          plenty: "xiong",
          extreme: "fennu",
        },
        {
          type: "累",
          normal: "fankun",
          plenty: "fankun1",
          extreme: "keshui",
        },
        {
          type: "不舒服",
          normal: "ganmao",
          plenty: "shoushang",
          extreme: "yousiliao",
        },
        {
          type: "约会",
          normal: "aixin",
          plenty: "xianwen",
          extreme: "aixin1",
        },
        {
          type: "如释重负",
          normal: "huqi",
          plenty: "none",
          extreme: "none",
        },
        {
          type: "惊喜",
          normal: "xingxingyan",
          plenty: "none",
          extreme: "none",
        },
        {
          type: "幸运",
          normal: "tianshi",
          plenty: "none",
          extreme: "none",
        },
        {
          type: "倒霉",
          normal: "shuai",
          plenty: "none",
          extreme: "none",
        },
        {
          type: "担心",
          normal: "jingkong",
          plenty: "none",
          extreme: "none",
        },
        {
          type: "无聊",
          normal: "mengbi",
          plenty: "none",
          extreme: "none",
        },
        {
          type: "饿",
          normal: "esi",
          plenty: "none",
          extreme: "none",
        },
        {
          type: "懒",
          normal: "en",
          plenty: "none",
          extreme: "none",
        },
        {
          type: "冷",
          normal: "leng",
          plenty: "none",
          extreme: "none",
        },
      ],
    };
  },
  methods: {
    ...mapMutations({
      set: "setMood",
    }),
    setMood(mood) {
      if (mood === "none") return;
      this.set(mood);
      this.back("mood");
    },
  },
};
</script>

<style lang="scss" scope>
.mood {
  position: absolute;
  width: 300px;
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

.el-table_1_column_4 {
  border-right: none;
}
</style>