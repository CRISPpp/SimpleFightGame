import { Player } from "./zbase.js";
import { GIF } from '/static/js/utils/gif.js';

class Character extends Player {
    constructor(root, info) {
        super(root, info);
        this.init_animations();
        this.character = info.character;
    }
    init_animations() {
        let outer = this;
        let offsets = [0, -22, -22, 0, 0, 0, 0];
        for (let i = 0; i < 7; i++) {
            let gif = GIF();
            gif.load(`/static/image/${outer.character}/${i}.gif`);
            outer.animations.set(i, {
                gif: gif,
                frame_cnt: 20,//总图片数
                frame_rate: 10,//每几帧过度一次
                offset_y: offsets[i],//y方向偏移量
                scale: 2,//放大多少倍
                loaded: false,
            });
            gif.onload = function () {
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;
                if (i === 3) {
                    obj.frame_rate = 20;
                }
            }
        }
    }
}

export {
    Character,
}