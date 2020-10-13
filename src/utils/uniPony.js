import axios from "axios";
class UniPony {
    constructor() {
        this.state = "normal";
        this.states = {
            "normal": "normal",
        };
        this.msgDict = {
            "morningGreetings": ["早上好，新的一天也要加油鸭！"],
            "noonGreetings": [],
            "afternoonGreetings": [],
            "eveningGreetings": [],
            "nightGreetings": [],
        }
        this.msgs = [
            {
                type: "test", 
                content: "哈哈哈哈哈啊哈哈~嗝"
            },
            // {
            //     type: "test",
            //     content: "晚上好，主人，记得早点休息哦！"
            // },
            // {
            //     type: "test",
            //     content: "啦啦啦啦啦啦啦啦"
            // } 
        ];


        this.year = 0,
        this.month = 0,
        this.day = 0,
        this.weekDay = 0,
        this.hrs = 0,
        this.mins = 0,
        this.secs = 0,
        this.date = "",
        this.time = "",
        this.city = "101280110"
        this.weather = null,
        
        this.init()
        this.watch();
    }
    async init() {
        await this.getWeather();
        this.getDate();
        this.getTime();
        this.msgs.push({
            type: "greetings",
            content: `今天是${this.date}， 现在是${this.time}，天气: ${this.weather.text}，气温：${this.weather.temp}°C`,
        })
    }
    say() {
        if (!this.msgs.length) return false;
        return this.msgs.shift();
    }
    saySomething() {

    }
    speak() {

    }
    zeroPad(num) {
        return num >= 10 ? num : "0" + num;
    }
    getDate() {
        let d = new Date();
        let weekDict = ["日", "一", "二", "三", "四", "五", "六"];
        this.year = d.getFullYear();
        this.month = d.getMonth() + 1;
        this.day = d.getDate();
        this.weekDay = d.getDay();
        this.date = `${this.year}年${this.month}月${this.day}日，星期${weekDict[this.weekDay]}`;
    }
    getTime() {
        let d = new Date();
        this.hrs = d.getHours();
        this.mins = d.getMinutes();
        this.secs = d.getSeconds();
        this.time = `${this.zeroPad(this.hrs)}:${this.zeroPad(this.mins)}:${this.zeroPad(this.secs)}`;
        if (!this.hrs && !this.mins && !this.secs) this.getDate();
    }
    getLocation() {
        // axios.get("https://geoapi.heweather.net/v2/city/lookup?location=" + this.location + "&key=14be35acfb5a43cfa9f3543698424940")
        //     .then(res => {

        //     })
    }
    getWeather() {
        if (!this.city) return false;
        return axios.get("https://devapi.heweather.net/v7/weather/now?location=" + this.city + "&key=14be35acfb5a43cfa9f3543698424940")
            .then(res => {
                let { temp, text } = res.data.now;
                this.weather = {
                    temp,
                    text
                }
                // console.log(temp + "°C", text)
            })
            .then(() => axios.get("https://devapi.heweather.net/v7/weather/3d?location=" + this.city + "&key=14be35acfb5a43cfa9f3543698424940"))
            .then(res => {
                console.log(res.data.daily);
                let { tempMax, tempMin } = res.data.daily[0];
                this.weather = {
                    ...this.weather,
                    tempRange: `${tempMin}°C - ${tempMax}°C`
                }
            })
    }    
    watch() {
        setInterval(() => {
            // 更新时间
            this.getTime();

            // 固定时间触发
            

            // 随机触发
            // if (Math.random() > .5) this.msgs.push("主人早上好，快去吃早餐！")

        }, 1000);
    }
}

const uniPony = new UniPony();

export {
    uniPony
};