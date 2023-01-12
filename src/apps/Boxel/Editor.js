import App from '../../libs/core/App';
import Color from '../../libs/core/Color';
import Button from '../../libs/html/Button';
import ColorPicker from '../../libs/html/ColorPicker';
import Input from '../../libs/html/Input';
import Vector2 from '../../libs/math/Vector2';
import SpriteEditor from './node/SpriteEditor';

export default class Editor extends App {
    constructor(canvas) {
        super(canvas);

        const sprite = new SpriteEditor();

        //Interface
        const ui = new ColorPicker();
        canvas.parent.appendChild(ui);
        ui.style = {
            position: 'absolute',
            left: '0vw',
            top: '0vh',
        }
        ui.color = Color.white();
        let mode = -1;
        function updateMode(value) {
            mode = value ?? ++mode % 3;
            if (mode === 0) {
                modeButton.text = '+';
            } else if (mode === 1) {
                modeButton.text = '=';
            } else if (mode === 2) {
                modeButton.text = '-';
            }
        }
        let colorPicking = false;
        const picker = new Button(() => {
            colorPicking = !colorPicking;
        });
        picker.text = '@';
        ui.appendChild(picker);
        const modeButton = new Button(() => {
            updateMode();
            canvas.vibrate(50);
        });
        updateMode();
        ui.appendChild(modeButton);
        const previousButton = new Button(() => {
            sprite.undo();
            canvas.vibrate(50);
        });
        previousButton.text = '<';
        ui.appendChild(previousButton);
        const nextButton = new Button(() => {
            sprite.redo();
            canvas.vibrate(50);
        });
        nextButton.text = '>';
        ui.appendChild(nextButton);
        const clearButton = new Button(() => {
            sprite.clear();
            canvas.vibrate(50);
        });
        clearButton.text = 'X';
        ui.appendChild(clearButton);
        const download = new Button(() => {
            canvas.saveFile(sprite.save(), 'sprite.jsbx', 'application/octet-stream');
            canvas.vibrate(50);
        });
        download.text = 'download';
        ui.appendChild(download);

        const open = new Input('file');
        open.element.addEventListener('input', (e) => {
            if (open.element.files.length > 0) {
                const file = open.element.files[0];
                file.arrayBuffer().then((b) => {
                    sprite.load(b);
                    open.element.value = null;
                });
            }
        });
        open.element.innerHTML = 'open';
        open.style = {
            color: 'transparent'
        }
        ui.appendChild(open);

        //control
        const zoomStep = 0.1;
        const cameraStep = 1;
        const orbitStep = 1;
        const cameraMovement = new Vector2();
        const orbitMovement = new Vector2();
        let zoom = 0;
        let rightClick = null;
        let middleClick = null;
        let leftClick = null;
        let castingBoxel = null;
        let inputs = [];
        let distance = 0;

        let canDraw = true;
        function addBoxel(normalizedVector2) {
            if (canDraw) {
                const result = mode === 2 ?
                    sprite.write(normalizedVector2)
                    : sprite.write(normalizedVector2, ui.color, mode === 0);
                if (result) {
                    canvas.vibrate(50);
                }
                canDraw = false;
            }
        }

        canvas.addEventListener('wheel', e => {
            zoom -= e.deltaY * zoomStep;
        });
        canvas.addEventListener('pointerdown', e => {
            if (colorPicking) {
                const result = sprite.read(canvas.getNormalizedPointerPosition(e));
                console.log(result);
                if(result){
                    ui.color = result;
                    colorPicking = false;
                }
            } else {
                canvas.setPointerCapture(e.pointerId);
                if (e.pointerType == 'touch' && inputs.length < 2) {
                    inputs.push(e);
                    if (inputs.length === 1) {
                        setTimeout(() => {
                            if (inputs.length == 0 || inputs[0] === e) {
                                castingBoxel = e.pointerId;
                                addBoxel(canvas.getNormalizedPointerPosition(e));
                            }
                        }, 75);
                    } else {
                        if (castingBoxel == inputs[0].pointerId) {
                            castingBoxel = null;
                        }
                    }
                } else if (e.pointerType == 'mouse') {
                    if (e.button === 0) {
                        leftClick = e;
                        castingBoxel = e.pointerId;
                        addBoxel(canvas.getNormalizedPointerPosition(e));
                    } else if (e.button === 2) {
                        rightClick = e;
                    } else if (e.button === 1) {
                        middleClick = e;
                    }
                } else if (e.pointerType == 'pen') {
                    castingBoxel = e.pointerId;
                }
            }
        });
        canvas.addEventListener('pointerup', e => {
            canvas.releasePointerCapture(e.pointerId);
            if (castingBoxel == e.pointerId) {
                castingBoxel = null;
            }
            if (e.pointerType == 'mouse') {
                if (leftClick && e.pointerId == leftClick.pointerId) {
                    leftClick = null;
                } else if (rightClick && e.pointerId == rightClick.pointerId) {
                    rightClick = null;
                } else if (middleClick && e.pointerId == middleClick.pointerId) {
                    middleClick = null;
                }
            }
            if (inputs.length > 0) {
                const index = inputs.findIndex(i => i.pointerId == e.pointerId);
                if (index !== -1) {
                    inputs.splice(index, 1);
                    if (inputs.length < 1) {
                        distance = 0;
                    }
                }
            }
        });
        canvas.addEventListener('pointermove', (e) => {
            if (castingBoxel == e.pointerId) {
                addBoxel(canvas.getNormalizedPointerPosition(e));
            } else if (e.pointerType == 'mouse') {
                if (middleClick && e.pointerId == middleClick.pointerId) {
                    orbitMovement[0] -= orbitStep * e.movementX;
                    orbitMovement[1] += orbitStep * e.movementY;
                    middleClick = e;
                } else if (rightClick && e.pointerId == rightClick.pointerId) {
                    cameraMovement[0] -= cameraStep * e.movementX;
                    cameraMovement[1] += cameraStep * e.movementY;
                    rightClick = e;
                }
            } else if (e.pointerType == 'touch') {
                if (inputs.length === 1) {
                    inputs[0] = e;
                    const pixelRatio = canvas.pixelRatio;
                    cameraMovement[0] -= cameraStep * pixelRatio * e.movementX;
                    cameraMovement[1] += cameraStep * pixelRatio * e.movementY;
                } else {
                    const index = inputs.findIndex(i => i.pointerId == e.pointerId);
                    if (index !== -1) {
                        inputs[index] = e;
                    }
                    const newDistance = new Vector2(inputs[0].pageX, inputs[0].pageY)
                        .distance(new Vector2(inputs[1].pageX, inputs[1].pageY));

                    const deltaDistance = newDistance - distance;
                    if (distance !== 0 && Math.abs(deltaDistance) > 1) {
                        zoom += deltaDistance * zoomStep;
                    } else {
                        const pixelRatio = canvas.pixelRatio;
                        orbitMovement[0] -= orbitStep * e.movementX;
                        orbitMovement[1] += orbitStep * e.movementY;
                    }
                    distance = newDistance;
                }
            }
        });
        this.canvas.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'a':
                case 'KeyA':
                    updateMode(0);
                    break;
                case 'u':
                case 'KeyU':
                    updateMode(1);
                    break;
                case 'd':
                case 'KeyD':
                case 'r':
                case 'KeyR':
                    updateMode(2);
                    break;
                case 'Space':
                    updateMode();
                    break;
                default:
                    break;
            }
        });

        //update
        let then = 0;
        this.run = (time) => {
            time *= 0.001
            if (time > then) {
                then = time + 0.15;
                canDraw = true;
            }

            const renderTarget = canvas.renderTarget;
            sprite.update(renderTarget, zoom, cameraMovement, orbitMovement);
            this.canvas.render(sprite);
            zoom = 0;
            cameraMovement.reset();
            orbitMovement.reset();
        }
    }
}