import { Object } from '../object/zbase.js';
import { Controller } from '/static/js/controller/zbase.js';
class GameMap extends Object {
    constructor(root) {
        super();
        this.root = root;
        this.$canvas = $(`<canvas width="1850" height="900" tabindex = 0></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.root.$crisp.append(this.$canvas);
        this.$canvas.focus();
        this.controller = new Controller(this.$canvas);
        this.root.$crisp.append($(`
                <div class="head">
            <div class="hp1"><div></div></div>
            <div class="timer">90</div>
            <div class="hp2"><div></div></div>
        </div>
        `));
        this.timeLeft = 90000;
        this.$timer = this.root.$crisp.find(".timer");
    }
    start() {

    }
    update() {
        this.timeLeft -= this.timedelta;
        if (this.timeLeft < 0) {
            this.timeLeft = 0;
            let [a, b] = this.root.players;

            a.hp = b.hp = 0;
        }
        this.$timer.text(parseInt(this.timeLeft / 1000));

        this.render();
    }
    render() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        // this.ctx.fillStyle = 'black';
        // this.ctx.fillRect(0, 0, this.$canvas.width(), this.$canvas.height());
    }
}

export {
    GameMap,
}