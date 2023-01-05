export default class App {
    /** Create a new app 
    */
    constructor(graphicRenderer, eventInterface) {
        this.graphicsRenderer = graphicRenderer;
        this.eventInterface = eventInterface;
        this.then = 0;
    }

    get renderTarget() {
        return this.graphicsRenderer.parent.renderTarget;
    }

    addEventListener(event, callback) {
        this.eventInterface.addEventListener(event, callback);
    }

    getPointerPosition(e) {
        return this.graphicsRenderer.parent.getPointerPosition(e);
    }

    getNormalizedPointerPosition(e){
        return this.graphicsRenderer.parent.getNormalizedPointerPosition(e);
    }

    run() {

    }

    stop() {
        this.then = 0;
        this.graphicsRenderer.childrens.forEach(c => this.graphicsRenderer.removeChild(c));
    }
}