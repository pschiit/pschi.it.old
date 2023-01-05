export default class App {
    /** Create a new app 
    */
    constructor(canvas) {
        this.canvas = canvas;
    }

    get renderTarget() {
        return this.canvas.parent.renderTarget;
    }

    run() {

    }

    stop() {

        this.canvas.context?.dispatchCallback(this.canvas.context.removeChild);
    }
}