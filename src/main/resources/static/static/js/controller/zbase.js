class Controller {
    constructor($canvas) {
        this.$canvas = $canvas;
        this.press_keys = new Set();
        this.start();
    }
    start() {
        let outer = this;
        this.$canvas.keydown(function (e) {
            outer.press_keys.add(e.key);
            //console.log(e.key);
        });
        this.$canvas.keyup(function (e) {
            outer.press_keys.delete(e.key);
        });
    }
}

export {
    Controller,
}