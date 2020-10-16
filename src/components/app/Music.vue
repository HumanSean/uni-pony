<template>
  <div
    class="music"
    :style="{ top: y + 'px', left: x + 'px' }"
    tabindex="0"
    @mousedown.ctrl.exact="move($event, 300, 80)"
    @keydown.space="play"
    @click.right.prevent
  >
    <audio
      ref="audio"
      @timeupdate="updateInfo"
      @canplay="loadDuration"
      @ended="next(true)"
    ></audio>
    <!-- 屏幕内容 -->
    <div class="screen">
      <span class="title" ref="title">{{ song.artist }} - {{ song.name }}</span>
      <span class="volume" v-if="showVolume">
        <svg class="icon small-icon" aria-hidden="true">
          <use xlink:href="#icon-volume"></use>
        </svg>
        {{ volume }}
      </span>
      <span class="time">
        {{ currentTime | formatTime }}/{{ duration | formatTime }}
      </span>
      <div class="lyric" ref="lyric" v-if="showLyric">
        {{ line }}
      </div>
    </div>
    <div class="playlist" v-if="showPlaylist" @click.right="back">
      <ul class="normal" v-if="showDetail">
        <li v-for="song in playlist[detail]" :key="song.songId">
          <span>{{ song.name }}</span>
          <span>
            <svg
              class="icon small-icon"
              aria-hidden="true"
              v-for="btn in songButtons"
              :key="btn.name"
              @click="btn.method(song)"
            >
              <use :xlink:href="`#icon-${btn.name}`"></use>
            </svg>
          </span>
        </li>
      </ul>
      <ul class="flex" v-else>
        <li
          v-for="l in lists"
          :key="l"
          @click="
            showDetail = true;
            detail = l;
          "
        >
          {{ l }}
        </li>
      </ul>
    </div>

    <!-- 按键区域 -->
    <div class="btn">
      <span class="left">
        <el-tooltip
          effect="dark"
          content="【左键】播放或暂停，【右键】开关按钮提示。"
          :visible-arrow="false"
          placement="bottom"
          :open-delay="1300"
          :disabled="hideTooltip"
        >
          <svg
            class="icon app-icon"
            aria-hidden="true"
            @click="play"
            @click.right.prevent="hideTooltip = !hideTooltip"
          >
            <use :xlink:href="`#icon-${state}`"></use>
          </svg>
        </el-tooltip>
        <el-tooltip
          effect="dark"
          content="【短按】切换上一首，【长按】快退当前歌曲。"
          :visible-arrow="false"
          placement="bottom"
          :open-delay="1300"
          :disabled="hideTooltip"
        >
          <svg
            class="icon app-icon"
            aria-hidden="true"
            @click="last"
            @mousedown="rewind"
            @mouseup="resume"
          >
            <use xlink:href="#icon-last"></use>
          </svg>
        </el-tooltip>
        <el-tooltip
          effect="dark"
          content="【短按】切换下一首，【长按】快进当前歌曲。"
          :visible-arrow="false"
          placement="bottom"
          :open-delay="1300"
          :disabled="hideTooltip"
        >
          <svg
            class="icon app-icon"
            aria-hidden="true"
            @click="next"
            @mousedown="fastForward"
            @mouseup="resume"
          >
            <use xlink:href="#icon-next"></use>
          </svg>
        </el-tooltip>
      </span>

      <el-tooltip
        effect="dark"
        content="【左键】切换上一个歌单，【右键】切换下一个歌单。"
        :visible-arrow="false"
        placement="bottom"
        :open-delay="1300"
        :disabled="hideTooltip"
      >
        <span
          class="list"
          ref="list"
          @click="changeList(1)"
          @click.right.prevent="changeList(0)"
          >{{ list }}</span
        >
      </el-tooltip>

      <span class="right">
        <el-tooltip
          effect="dark"
          content="【左键】增大音量，【右键】降低音量。"
          :visible-arrow="false"
          placement="bottom"
          :open-delay="1300"
          :disabled="hideTooltip"
        >
          <svg
            class="icon app-icon"
            aria-hidden="true"
            @mousedown.left="increaseVolumn"
            @mousedown.right="decreaseVolumn"
            @click.right.prevent
            @mouseup="setVolumn"
          >
            <use xlink:href="#icon-volume"></use>
          </svg>
        </el-tooltip>
        <el-tooltip
          effect="dark"
          content="【左键】或【右键】切换当前播放模式。"
          :visible-arrow="false"
          placement="bottom"
          :open-delay="1300"
          :disabled="hideTooltip"
        >
          <svg
            class="icon app-icon"
            aria-hidden="true"
            @click="changePlayMethod"
          >
            <use :xlink:href="`#icon-${playMethod}`"></use>
          </svg>
        </el-tooltip>
        <el-tooltip
          effect="dark"
          :visible-arrow="false"
          placement="bottom"
          :open-delay="1300"
          :disabled="hideTooltip"
        >
          <div slot="content" style="text-align: center; line-height: 1.5">
            【左键】打开/关闭歌单列表，【右键】新增歌曲。<br />打开后在MP3屏幕上按【右键】返回上一层。
          </div>
          <svg
            class="icon app-icon"
            aria-hidden="true"
            @click="showPlaylist = !showPlaylist"
          >
            <use xlink:href="#icon-playlist"></use>
          </svg>
        </el-tooltip>
      </span>
    </div>
  </div>
</template>

<script>
import shuffle from "underscore/modules/shuffle.js";
import { mapGetters, mapMutations, mapState } from "vuex";
import subApp from "../../mixins/subApp";
export default {
  mixins: [subApp],
  data() {
    return {
      // position
      x: window.innerWidth / 2 - 150,
      y: window.innerHeight / 2 - 40,
      state: "play",
      // songs
      list: "精选歌单",
      song: null,
      duration: 0,
      currentTime: 0,
      // lyric
      lyric: [],
      showLyric: false,
      line: "",
      lyricIndex: 0,
      // overflow: scroll
      scrollTimer: null,
      scrollLyric: null,
      titleScroll: null,
      scrollWidth: 0,
      listScroll: null,
      listScrollWidth: 0,
      // fast forward or rewind
      alterTime: null,
      shallChangeProgress: null,
      changingProgress: false,
      // volume
      volume: 52,
      showVolume: false,
      changeVolumn: null,
      hideVolumn: null,
      // playMethod
      playMethod: "loop",
      // playlist
      showPlaylist: false,
      showDetail: false,
      detail: "",
      songButtons: [
        { name: "download", method: this.downloadSong },
        { name: "delete", method: this.removeSong },
        { name: "songList", method: this.songList },
      ],

      hideTooltip: false,
    };
  },
  computed: {
    ...mapState(["songs"]),
    ...mapGetters(["playlist", "lists"]),
    currentPlaylist() {
      if (this.playMethod === "shuffle") {
        return shuffle(this.playlist[this.list]);
      } else {
        return this.playlist[this.list];
      }
    },
  },
  filters: {
    formatTime: function (val) {
      let min = Math.floor(val / 60);
      let sec = val % 60;
      min = min >= 10 ? min : "0" + min;
      sec = sec >= 10 ? sec : "0" + sec;
      return min + ":" + sec;
    },
  },
  methods: {
    ...mapMutations([]),
    // getSongInfo
    loadSong() {
      this.$refs.audio.src =
        this.song.src ||
        "http://music.163.com/song/media/outer/url?id=" + this.song.songId;
      this.getLyric();
      this.$nextTick(() => {
        this.scrollTitle();
      });
    },
    getLyric() {
      this.$axios
        .get(
          `https://api.imjad.cn/cloudmusic/?type=lyric&id=${this.song.songId}`
        )
        .then((res) => {
          if (res.data.lrc) {
            let lyric = res.data.lrc.lyric;
            this.lyric = lyric
              .replace(/\n/g, "<divider>")
              .split("<divider>")
              .filter((line) => line)
              .map((line) => line.slice(1).split("]"))
              .map((line) => {
                line[0] = this.readTime(line[0]);
                return line;
              })
              .filter((line) => !isNaN(line[0]));

            this.showLyric = true;
          }
        });
    },
    readTime(time) {
      let [min, sec] = time.split(":");
      return parseInt(min) * 60 + Math.round(parseFloat(sec));
    },
    scrollTitle() {
      clearInterval(this.titleScroll);
      let title = this.$refs.title;
      if (title.offsetWidth !== title.scrollWidth) {
        this.titleScroll = setInterval(() => {
          if (title.offsetWidth + title.scrollLeft >= title.scrollWidth) {
            this.scrollWidth = -0.5;
          }
          if (title.scrollLeft === 0) {
            this.scrollWidth = 1;
          }
          title.scrollBy(this.scrollWidth, 0);
        }, 99);
      }
    },
    scrollList() {
      clearInterval(this.listScroll);
      let list = this.$refs.list;
      if (list.offsetWidth !== list.scrollWidth) {
        this.listScroll = setInterval(() => {
          if (list.offsetWidth + list.scrollLeft >= list.scrollWidth) {
            this.listScrollWidth = -0.5;
          }
          if (list.scrollLeft === 0) {
            this.listScrollWidth = 1;
          }
          list.scrollBy(this.listScrollWidth, 0);
        }, 99);
      }
    },
    loadDuration() {
      this.duration = Math.round(this.$refs.audio.duration);
    },
    updateInfo() {
      let audio = this.$refs.audio;
      this.currentTime = Math.floor(audio.currentTime);
      // 更新歌词
      if (
        this.lyric[this.lyricIndex] &&
        this.lyric[this.lyricIndex][0] < audio.currentTime
      ) {
        this.line = this.lyric[this.lyricIndex][1];
        this.lyricIndex++;
      }
    },
    updateLyric() {
      let index = this.lyric.findIndex(
        (line) => line[0] > this.$refs.audio.currentTime
      );
      let lyricIndex = index - 1 >= 0 ? index - 1 : index;
      this.line = this.lyric[lyricIndex][1];
      this.lyricIndex = lyricIndex;
    },

    // buttons
    play() {
      if (this.state === "play") {
        this.state = "pause";
        this.$refs.audio.play();
      } else {
        this.state = "play";
        this.$refs.audio.pause();
      }
    },
    next(auto) {
      if (this.changingProgress) {
        this.changingProgress = false;
        return;
      }
      // 暂停及隐藏歌词
      this.$refs.audio.pause();
      this.showLyric = false;
      this.line = "";
      // 根据不同播放模式来进行对应操作
      let index = this.currentPlaylist.indexOf(this.song);
      if (
        this.playMethod === "loop" ||
        (this.playMethod === "singleLoop" && auto !== true) ||
        this.playMethod === "shuffle"
      ) {
        index++;
        if (index === this.currentPlaylist.length) index = 0;
        this.song = this.currentPlaylist[index];
      }
      this.loadSong();
      this.lyricIndex = 0;
      this.$refs.audio.play();
      this.state = "pause";
    },
    last() {
      if (this.changingProgress) {
        this.changingProgress = false;
        return;
      }
      // 暂停及隐藏歌词
      this.$refs.audio.pause();
      this.showLyric = false;
      this.line = "";
      // 上一曲逻辑
      let index = this.currentPlaylist.indexOf(this.song);
      index--;
      if (index === -1) index = this.currentPlaylist.length - 1;
      this.song = this.currentPlaylist[index];
      // 加载新的歌曲
      this.loadSong();
      this.lyricIndex = 0;
      this.$refs.audio.play();
      this.state = "pause";
    },
    fastForward() {
      this.shallChangeProgress = setTimeout(() => {
        this.changingProgress = true;
        this.$refs.audio.pause();
        this.alterTime = setInterval(() => {
          if (this.currentTime < this.duration) {
            this.currentTime++;
          }
        }, 20);
      }, 300);
    },
    rewind() {
      this.shallChangeProgress = setTimeout(() => {
        this.changingProgress = true;
        this.$refs.audio.pause();
        this.alterTime = setInterval(() => {
          if (this.currentTime > 0) {
            this.currentTime--;
          }
        }, 20);
      }, 300);
    },
    resume() {
      clearTimeout(this.shallChangeProgress);
      if (this.changingProgress) {
        clearInterval(this.alterTime);
        this.$refs.audio.currentTime = this.currentTime;
        this.updateLyric();
        this.$refs.audio.play();
      }
    },
    increaseVolumn() {
      clearInterval(this.changeVolumn);
      clearTimeout(this.hideVolumn);
      this.changeVolumn = setInterval(() => {
        if (this.volume < 100) this.volume++;
      }, 100);
      this.showVolume = true;
    },
    decreaseVolumn() {
      clearInterval(this.changeVolumn);
      clearTimeout(this.hideVolumn);
      this.changeVolumn = setInterval(() => {
        if (this.volume > 0) this.volume--;
      }, 100);
      this.showVolume = true;
    },
    setVolumn() {
      clearInterval(this.changeVolumn);
      this.$refs.audio.volume = this.volume / 100;
      this.hideVolumn = setTimeout(() => {
        this.showVolume = false;
      }, 1000);
    },
    changePlayMethod() {
      let methods = ["loop", "shuffle", "singleLoop"];
      let index = methods.indexOf(this.playMethod);
      index++;
      if (index === methods.length) index = 0;
      this.playMethod = methods[index];
    },
    changeList(dir) {
      let index = this.lists.indexOf(this.list);
      console.log(111);
      if (dir) {
        index++;
        if (index === this.lists.length) index = 0;
      } else {
        if (index === 0) index = this.lists.length;
        index--;
      }
      this.list = this.lists[index];
    },
    back() {
      if (this.showDetail) {
        this.showDetail = false;
      } else {
        this.showPlaylist = false;
      }
    },
    downloadSong() {

    },
    removeSong(song) {
      if (this.detail === "所有歌曲") {
        console.log(111);
      } else {
        song.list.splice(song.list.indexOf(this.detail), 1);
      }
    },
  },
  watch: {
    // scroll
    line() {
      let lyric = this.$refs.lyric;
      if (!lyric) return;
      lyric.scrollBy(0, -99);
      clearTimeout(this.scrollTimer);
      clearInterval(this.scrollLyric);
      this.$nextTick(() => {
        if (lyric.offsetHeight !== lyric.scrollHeight) {
          this.scrollTimer = setTimeout(() => {
            this.scrollLyric = setInterval(() => {
              lyric.scrollBy(0, 1);
            }, 120);
          }, 800);
        }
      });
    },
    list() {
      this.$refs.audio.pause();
      this.state = "play";
      this.line = "";
      this.song = this.currentPlaylist[0];
      this.loadSong();
      this.lyricIndex = 0;
    },
  },
  created() {
    this.song = this.currentPlaylist[0];
  },
  mounted() {
    this.loadSong();
    this.scrollList();
    this.$refs.audio.volume = this.volume / 100;
  },
};
</script>

<style lang="scss" scoped>
.music {
  position: absolute;
  width: 300px;
  height: 80px;
  border-radius: 3px;
  overflow: hidden;
  user-select: none;
  background: #111;
}
.app-icon {
  color: #fff;
  width: 16px;
  height: 16px;
  margin: 0 5px;
}
.screen {
  & {
    position: relative;
    left: 2%;
    top: 5%;
    width: 96%;
    height: 60%;
    border-radius: 3px;
    border: 1px solid #fff;
    font-size: 10px;
    color: #eee;
    padding: 3px;
    box-sizing: border-box;
  }
  .title {
    display: inline-block;
    border-radius: 3px;
    width: 160px;
    white-space: nowrap;
    overflow: hidden;
    border-radius: 3px;
    box-sizing: border-box;
    padding: 0 3px;
  }
  .volume {
    position: absolute;
    right: 84px;
    top: 3px;
  }
  .small-icon {
    vertical-align: -0.1em;
    margin-right: -2px;
  }
  .time {
    display: inline-block;
    width: 70px;
    text-align: center;
    position: absolute;
    right: 3px;
    top: 3px;
  }
  .lyric {
    position: relative;
    text-align: center;
    height: 16px;
    overflow: hidden;
  }
}

.playlist {
  & {
    position: absolute;
    left: 2%;
    top: 5%;
    width: 96%;
    height: 60%;
    border-radius: 3px;
    border: 1px solid #fff;
    font-size: 10px;
    color: #eee;
    padding-left: 0;
    box-sizing: border-box;
    background: #111;
    overflow: hidden;
  }
  ul::-webkit-scrollbar-thumb {
    background: #fff;
  }
  ul {
    height: 46px;
    overflow: auto;
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
  }
  li {
    list-style-type: none;
    cursor: pointer;
  }
  .flex li {
    margin: 3px 5px;
  }
  .normal li {
    padding: 5px;
    border-bottom: 1px solid #fff;
    border-right: 1px solid #fff;
  }
  .normal span:first-of-type {
    display: inline-block;
    width: 210px;
    white-space: nowrap;
    overflow: hidden;
  }
  .normal span:last-of-type {
    float: right;
  }
  .normal .small-icon {
    width: 16px;
    height: 16px;
    vertical-align: -0.39em;
    margin-left: 5px;
  }
}

.btn {
  margin-top: 8px;
}

.list {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 3px;
  color: #111;
  background: #fff;
  padding: 0 5px;
  margin-top: 2px;
  font-size: 12px;
  text-align: center;
  max-width: 130px;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
}
.right {
  float: right;
}
</style>