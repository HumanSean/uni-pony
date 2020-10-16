import globalUtil from "../utils/main";
const subApp = {
    methods: {
        back(name) {
            this.$destroy();
            globalUtil.destroy(name);
        },
        move(e, width, height) {
            let x1 = e.clientX;
            let y1 = e.clientY;
            document.onmousemove = (el) => {
                let x2 = el.clientX;
                let y2 = el.clientY;
                this.x += x2 - x1;
                this.y += y2 - y1;
                if (this.x < 0) this.x = 0;
                if (this.y < 0) this.y = 0;
                if (this.x > window.innerWidth - width) this.x = window.innerWidth - width;
                if (this.y > window.innerHeight - height) this.y = window.innerHeight - height;
                x1 = x2;
                y1 = y2;
            };
            document.onmouseup = () => {
                document.onmousemove = null;
            };
        },
    }
}
export default subApp;