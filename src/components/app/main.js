import Vue from "vue";
import Mood from "./Mood.vue";
import Settings from "./Settings.vue";
import Notebook from "./Notebook.vue";
import Todolist from "./Todolist.vue";
import Tomato from "./Tomato.vue";
import Music from "./Music.vue";
import Movie from "./Movie.vue";
import Game from "./Game.vue";
import Chat from "./Chat.vue";
import Weather from "./Weather.vue";
import Diary from "./Diary.vue";
import ElementUI from "element-ui";
import '../../styles.scss';
import store from '../../store';

import "../../assets/iconfont/iconfont";

import globalUtil from "../../utils/main";

import axios from "axios";


Vue.prototype.$axios = axios;

Vue.use(ElementUI);

const appList = {
    Mood,
    Settings,
    Notebook,
    Todolist,
    Tomato,
    Music,
    Movie,
    Game,
    Chat,
    Weather,
    Diary
}
const multipleList = {
    Settings
}

const init = (name) => {
    let appName = globalUtil.capitalize(name);
    let App = appList[appName];
    if (document.querySelector(`.${name}`)) {
        // 防止重复打开
        if (!(appName in multipleList)) {
            return;
        }
    }
    let div = document.createElement("div");
    div.setAttribute("id", name);
    document.body.appendChild(div);
    return new Vue({
        store,
        render: (h) => {
            return h(
                App
                // , {
                //     props: {
                //         text: options.props.text
                //     }
                // }
            )
        }
    }).$mount(`#${name}`);
}

export default init;