import Editor from './apps/Boxel/Editor';
import Lights from './apps/lights/Lights';
import HtmlNode from './libs/html/HtmlNode';
import WebGLCanvas from './libs/html/WebGLCanvas';

const defaultStyle = {
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
    background: 'transparent',
    'touch-action': 'none'
};
HtmlNode.document.style = defaultStyle;
const body = HtmlNode.body;
body.style = defaultStyle;
const canvas = new WebGLCanvas( {antialias: true});
body.appendChild(canvas);
canvas.fitParent();

window.onresize = (e) => {
    canvas.fitParent();
};

let app = getApp(window.location.pathname.replace('/', ''));
let animationFrame = requestAnimationFrame(run);
let then = 0;

function getApp(name) {
    if (app) {
        app.stop();
    }
    switch (name) {
        case 'lights':
            return new Lights(canvas);
        case 'editor':
            default:
            return new Editor(canvas);
    }
}

function run(time) {
    time *= 0.001;
    canvas.element.setAttribute('fps', Math.round(1 / (time - then)).toString());
    then = time;
    app.run();
    animationFrame = requestAnimationFrame(run);
}