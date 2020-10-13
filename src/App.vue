<template>
  <div id="app">
    <el-popover
      placement="top-end"
      trigger="manual"
      v-model="visible"
      width="260"
    >
      <!-- 一级菜单 -->
      <span v-if="type === 'tool' && tool === 'first'">
        <svg
          class="icon app-icon"
          aria-hidden="true"
          v-for="icon in mainTools"
          :key="icon"
          @click="showDetail(icon)"
        >
          <use :xlink:href="`#icon-${icon}`"></use>
        </svg>
      </span>
      <!-- 二级菜单 -->
      <span v-else-if="type === 'tool' && tool === 'second'">
        <svg
          class="icon app-icon"
          aria-hidden="true"
          v-for="icon in subTools[subTool]"
          :key="icon"
          @click="init(icon)"
        >
          <use :xlink:href="`#icon-${icon}`"></use>
        </svg>
      </span>
      <!-- 对话消息 -->
      <span v-if="type === 'msg'">
        {{ msg }}
      </span>

      <img
        id="pony"
        :style="{ top: y + 'px', left: x + 'px' }"
        ref="img"
        :src="img"
        alt=""
        draggable="true"
        @keydown.ctrl.alt="handleKeydown($event)"
        @mousedown="move($event)"
        @click.exact="speak"
        @click.right.prevent="useTool"
        @click.ctrl.exact="useTool"
        slot="reference"
      />
    </el-popover>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { uniPony } from "./utils/uniPony";
import initUtil from "./components/app/main";

// import globalUtil from "./utils/main"
export default {
  name: "App",
  data() {
    return {
      // 形象相关
      imgs: [
        "normal",
        "laugh",
        "good",
        "shy",
        "shock",
        "oh",
        "kiss",
        "love",
        "wow",
        "embarrass",
        "plan",
        "cool",
        "money",
        "wine",
        "dance",
      ],
      img: "",

      // 位置相关
      x: window.innerWidth - 100,
      y: window.innerHeight - 91,
      moved: false,

      // 弹框相关
      type: "tool", // 弹框类型：msg / tool
      tool: "first",
      visible: false, // 弹框的开启/关闭状态
      speaking: false, // 根据是否处在讲话状态，判断能否关闭弹框
      hideTimer: null, // 自动隐藏弹框的定时器
      msg: "", // 弹框对话消息
      msgContent: "", // 辅助实现逐字效果的对话消息
      mainTools: ["buddy", "efficiency", "relax", "settings"],
      subTool: "",
      subTools: {
        buddy: ["chat", "weather", "diary", "back"],
        efficiency: ["notebook", "todolist", "tomato", "back"],
        relax: ["music", "movie", "game", "back"],
      },
      // 消息监控
      watcher: null,
    };
  },
  computed: {
    ...mapState(["movable", "autoHide", "hideDelay", "impTypes", "mood", "shortcuts"]),
    ...mapGetters(["shortcutsMap"]),
    imgSrc() {
      return this.imgs.map((img) => require(`./assets/${img}.png`));
    },
  },
  methods: {
    // 移动uni-pony
    move(e) {
      // 固定住了
      if (!this.movable) return;

      // 移动逻辑
      let x1 = e.clientX;
      let y1 = e.clientY;
      document.onmousemove = (el) => {
        let x2 = el.clientX;
        let y2 = el.clientY;
        this.x += x2 - x1;
        this.y += y2 - y1;
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x > window.innerWidth - 100) this.x = window.innerWidth - 100;
        if (this.y > window.innerHeight - 91) this.y = window.innerHeight - 91;
        x1 = x2;
        y1 = y2;
        this.moved = true;
      };
      document.onmouseup = () => {
        document.onmousemove = null;
      };
    },

    handleKeydown(e) {
      let name = this.shortcutsMap[e.key];
      if (!name) return;
      if (["buddy", "efficiency", "relax"].includes(name)) {
        // 重复按，把自己按没
        if (this.visible && this.type === "tool" && this.tool === "second" && this.subTool === name) {
          this.visible = false;
          return;
        }
        // 快捷菜单
        if (!this.visible) this.useTool();
        this.tool = "second";
        this.subTool = name;
      } else if (name === "main") {
        // 重复按，把自己按没
        if (this.visible && this.type === "tool" && this.tool === "first") {
          this.visible = false;
          return;
        }
        if (!this.visible) {
          this.useTool();
        }
        this.tool = "first";
      } else {
        // 打开应用
        this.init(name);
      }
    },
    speak() {
      // 如果是移动触发的点击，不可弹出弹框，但可在允许情况下（非说话中/工具条）隐藏弹框
      if (this.moved) {
        if (!this.speaking) this.visible = false;
        this.moved = false;
        return;
      }

      if (this.visible) {
        // 话还没说完不准打断！
        if (this.speaking) return;
        // 话说完了就可以手动关掉，顺带清除自动关的定时器（如果有
        clearTimeout(this.hideTimer);
        this.visible = false;
        return;
      }

      // @todo: 对话的逻辑
      this.type = "msg";
      this.visible = true;
      
      // 自动隐藏对话
      if (this.autoHide) {
        this.hideTimer = setTimeout(() => {
          this.visible = false;
        }, this.hideDelay * 1000 + (this.msgContent.length - this.msg.length) * 50);
      }

    },
    useTool() {
      // 同上，关掉当前对话框
      if (this.visible) {
        if (this.speaking) return;
        clearTimeout(this.hideTimer);
        this.visible = false;
        return;
      }

      this.type = "tool";
      this.visible = true;
    },
    showDetail(name) {
      if (["buddy", "efficiency", "relax"].includes(name)) {
        // 进入子菜单
        this.subTool = name;
        this.tool = "second";
      } else if (["bookshelf", "settings"].includes(name)) {
        // 开启书架或设置
        this.init(name);
      } else {
        // 情绪管理
        this.init("mood");
      }
    },
    // 启动应用
    init(name) {
      if (name === "back") {
        this.tool = "first";
        return;
      }
      initUtil(name);
      this.visible = false;
    },
  },
  mounted() {
    this.img = this.imgSrc[0];
    // let i = 0;
    // setInterval(() => {
    //   i++;
    //   if (i === 15) i = 0;
    //   this.img = this.imgSrc[i];
    // }, 1000);
    // createMessage({
    //   props: {
    //     text: '这是一个弹窗'
    //   }
    // })
    // 初始化心情
    this.mainTools.unshift(this.mood);

    uniPony.speak = this.speak.bind(this);
    // 一有消息就调用
    this.watcher = setInterval(() => {
      if (uniPony.msgs.length && !this.visible) {
        uniPony.speak();
      }
    }, 1000);

    // 自动对焦
    this.$refs.img.focus();

    // 屏蔽右键默认属性
    document.ondragstart = function (e) {
      e.preventDefault();
    };
    document.ondragend = function (e) {
      e.preventDefault();
    };
  },
  watch: {
    visible(n) {
      // 显示消息
      if (n && this.type === "msg") {
        // 进入讲话状态
        this.speaking = true;

        // 获取讲话内容
        let msg = uniPony.say();
        this.msgContent = msg.content;
        // 不自动隐藏的类型
        if (this.impTypes.includes(msg.type)) {
          clearTimeout(this.hideTimer);
        }
        // 内容逐字显示效果
        for (let i = 0; i <= this.msgContent.length; i++) {
          setTimeout(() => {
            this.msg = this.msgContent.slice(0, i);

            // 结束讲话状态
            if (i === this.msgContent.length) {
              setTimeout(() => {
                this.speaking = false;
              }, 300);
            }
          }, 50 * i);
        }
      }
      if (!n) {
        if (this.type === "msg") {
          // 隐藏之后清空消息
          this.msg = "";
        } else {
          // 重置工具条状态
          setTimeout(() => {
            this.tool = "first";
          }, 300);
        }
      }
    },
    // 改变心情状态（强制更新DOM
    mood(n) {
      this.mainTools[0] = n;
      this.mainTools.splice(0, 0);
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  outline: none;
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}
::-webkit-scrollbar-thumb {
  background: #ccf3e2;
}
::-webkit-scrollbar-track {
  background: transparent;
}
html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#app img {
  position: absolute;
  width: 100px;
  cursor: pointer;
}
.app-icon {
  width: 26px;
  height: 26px;
  margin: 0 7px;
  cursor: pointer;
}
.el-popover {
  background: rgba(255, 255, 255, 0.7) !important;
  border-radius: 26px !important;
  padding: 10px 20px !important;
  text-align: center !important;
}
.el-popover span {
  text-align: justify;
}
</style>
