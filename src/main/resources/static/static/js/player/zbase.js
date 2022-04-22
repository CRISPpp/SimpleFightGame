import { Object } from '/static/js/object/zbase.js';

class Player extends Object {
    constructor(root, info) {
        super();
        this.root = root;
        this.ctx = this.root.game_map.ctx;
        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;
        this.character = info.character;
        this.vx = 0;
        this.vy = 0;
        this.speedx = 800;
        this.speedy = 4000;
        this.G = 50;
        this.status = 3;//0站立，1前，2后，3跳，4攻击，5挨打，6死亡
        this.press_keys = this.root.game_map.controller.press_keys;
        this.direction = 1;//1右边, 0左边
        this.animations = new Map();
        this.frame_current_cnt = 0;
        this.hp = 100;
        this.$hp = $(`#crisp>.head>.hp${this.id + 1}>div`);
        this.markTime = -1;
        this.markTime2 = -1;
        this.mark = false;
    }

    start() {

    }

    update_control() {

        let w, a, d, space;
        if (this.id === 0) {
            w = this.press_keys.has('w');
            a = this.press_keys.has('a');
            d = this.press_keys.has('d');
            space = this.press_keys.has(' ');
        } else {
            w = this.press_keys.has('ArrowUp');
            a = this.press_keys.has('ArrowLeft');
            d = this.press_keys.has('ArrowRight');
            space = this.press_keys.has('Enter');
        }

        if (this.status === 0 || this.status === 1 || this.status === 2) {
            if (space) {
                this.status = 4;
                this.vx = 0;

            }
            else if (w) {
                if (d) {
                    this.vx = this.speedx;
                } else if (a) {
                    this.vx = -this.speedx;
                } else {
                    this.vx = 0;
                }
                this.vy = -this.speedy;
                this.status = 3;
            } else if (d) {
                this.vx = this.speedx;
                this.status = 1;
            } else if (a) {
                this.vx = -this.speedx;
                this.status = 1;
            } else {
                this.status = 0;
                this.vx = 0;
                this.vy = 0;
            }
        }
    }

    update_dirction() {
        if (this.status === 6) return false;
        let players = this.root.players;
        if (players[0] && players[1]) {
            let me = this, you = players[1 - this.id];
            if (me.x > you.x) me.direction = -1;
            else me.direction = 1;
        }
    }

    is_attack() {
        this.frame_current_cnt = 0;
        this.status = 5;
        this.hp = Math.max(this.hp - 4, 0);
        // this.$hp.animate({
        //     width: this.$hp.parent().width() * this.hp / 100
        // });
        this.$hp.width(this.$hp.parent().width() * this.hp / 100);
        if (this.hp === 0) {
            this.status = 6;
        }
    }
    update_attack() {
        let obj = this.animations.get(this.status);
        if (this.status === 4 && parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt === obj.frame_cnt - 1) {
            let me = this;
            let en = this.root.players[1 - this.id];
            if (en.status != 6) {
                let r1;
                if (this.direction > 0) {
                    r1 = {
                        x1: me.x + 120,
                        y1: me.y + 40,
                        x2: me.x + 120 + 100,
                        y2: me.y + 40 + 20,
                    };
                } else {
                    r1 = {
                        x1: me.x + me.width - 120 - 100,
                        y1: me.y + 40,
                        x2: me.x + me.width - 120 - 100 + 100,
                        y2: me.y + 40 + 20,
                    }
                }
                let r2 = {
                    x1: en.x,
                    y1: en.y,
                    x2: en.x + en.width,
                    y2: en.y + en.height,
                }
                let fun = (a, b) => {
                    if (Math.max(a.x1, b.x1) > Math.min(a.x2, b.x2)) {
                        return false;
                    }
                    if (Math.max(a.y1, b.y1) > Math.min(b.y2, b.y2)) {
                        return false;
                    }
                    return true;
                }
                if (fun(r1, r2)) {
                    en.is_attack();
                }
            }
        }
    }
    update() {
        if (this.hp === 0) {

            this.status = 6;
            if (this.markTime === -1) {
                this.markTime = new Date().getTime();
            }
            this.markTime2 = new Date().getTime();

            if ((this.markTime2 - this.markTime) >= 1000) {
                if (this.mark === false) {
                    location.reload();
                    this.mark = true;
                }
            }
        }
        this.update_dirction();
        this.update_control();
        this.render();
        this.move();
        this.update_attack();
    }
    move() {
        this.vy += this.G;
        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;
        if (this.y > 600) {
            this.y = 600;
            this.vy = 0;
            if (this.status === 3)
                this.status = 0;
        }
        // if (this.id === 0)
        //     console.log(this.x);
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x > this.ctx.canvas.width - this.width) {
            this.x = this.ctx.canvas.width - this.width;
        }
    }
    render() {

        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);

        if (this.direction > 0) {
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(this.x + 120, this.y + 40, 100, 20);
        } else {
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(this.x + this.width - 120 - 100, this.y + 40, 100, 20);
        }

        let status = this.status;

        if (status === 1 && this.vx * this.direction < 0) status = 2;
        let obj = this.animations.get(status);
        if (this.direction < 0 || this.status === 6) {
            this.ctx.save();
            this.ctx.scale(-1, 1);
            this.ctx.translate(-this.ctx.canvas.width, 0);

            if (obj && obj.loaded) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                let scale = obj.scale;
                this.ctx.drawImage(image, this.ctx.canvas.width - this.x - this.width, this.y + obj.offset_y, image.width * scale, image.height * scale);
            }

            this.ctx.restore();
        } else {
            if (obj && obj.loaded) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                let scale = obj.scale;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * scale, image.height * scale);
            }
        }

        if ((this.status === 4 || this.status === 5 || this.status === 6) && parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt === obj.frame_cnt - 1) {
            if (this.status === 6) this.frame_current_cnt--;
            else this.status = 0;
        }

        this.frame_current_cnt++;

    }
}

export {
    Player,
}