let Objects = [];

class Object {
    constructor() {
        Objects.push(this);
        this.timedelta = 0;
        this.has_call_start = false;
        this.start();
    }
    start() {

    }
    update() {

    }
    destroy() {
        for (let i = 0; i < Objects.length; i++) {
            if (Objects[i] === this) {
                Objects.splice(i, 1);
                break;
            }
        }
    }
}
let last_timestamp;
let OBJECTS_FRAME = (timestamp) => {
    for (let obj of Objects) {
        if (!obj.has_call_start) {
            obj.has_call_start = true;
            obj.start();
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(OBJECTS_FRAME);
}

requestAnimationFrame(OBJECTS_FRAME);

export {
    Object,
}