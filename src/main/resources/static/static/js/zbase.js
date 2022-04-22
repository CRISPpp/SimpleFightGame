import { GameMap } from '/static/js/game_map/zbase.js';
import { Character } from '/static/js/player/ch.js';
class Main {
    constructor(id, backgroundNum, ch1, ch2) {
        this.$crisp = $(`#${id}`);

        this.$crisp.css({
            "position": "absolute",
            "background-image": `url(/static/image/background/${backgroundNum})`,
            "background-size": "100%,100%",
            "width": "1850px",
            "height": "900px",
            "background-position": "top",
        });

        this.game_map = new GameMap(this);
        this.players = [new Character(this, {
            id: 0,
            x: 0,
            y: 0,
            width: 150,
            height: 200,
            color: "blue",
            character: `${ch1}`,
        }),
        new Character(this, {
            id: 1,
            x: 500,
            y: 0,
            width: 150,
            height: 200,
            color: "green",
            character: `${ch2}`,
        })]
    }
}

export {
    Main,
}