import OrthographicCamera from '../../libs/3d/camera/OrthographicCamera';
import DirectionalLight from '../../libs/3d/light/DirectionalLight';
import Grid from '../../libs/3d/node/Grid';
import Node3d from '../../libs/3d/Node3d';
import App from '../../libs/core/App';
import Color from '../../libs/core/Color';
import Button from '../../libs/html/Button';
import ColorPicker from '../../libs/html/ColorPicker';
import Input from '../../libs/html/Input';
import Vector2 from '../../libs/math/Vector2';
import Vector3 from '../../libs/math/Vector3';
import SpriteEditor from './box/SpriteEditor';
import BoxWorld from './node/BoxWorld';

export default class Editor extends App {
    constructor(canvas) {
        super(canvas);
        canvas.renderTarget.backgroundColor = Color.white();

        //World
        const world = new Node3d();
        //camera
        const camera = new OrthographicCamera();
        const orbit = new Node3d();
        world.appendChild(orbit);
        orbit.translate(0, 0, 0);
        camera.zoom = 128;
        orbit.appendChild(camera);
        camera.target = orbit;
        // light
        const sun = new DirectionalLight(
            Color.white(),
            new Vector3(256, 256, -256),
            new Vector3());
        world.appendChild(sun);
        //grid
        const grid = new Grid(camera);
        world.appendChild(grid);
        grid.material.sizes = new Vector2(1, 10);

        //box world
        const spriteEditor = new SpriteEditor();
        const boxWorld = new BoxWorld(
            [spriteEditor.sprite]
        );
        world.appendChild(boxWorld);

        //update
        let updateGrid = true;
        let previousScale = 0;

        //Interface
        const ui = new ColorPicker();
        ui.color = [255, 255, 255];
        canvas.parent.appendChild(ui);
        ui.style = {
            position: 'absolute',
            left: '0vw',
            top: '0vh',
        }
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
            spriteEditor.undo();
            canvas.vibrate(50);
        });
        previousButton.text = '<';
        ui.appendChild(previousButton);
        const nextButton = new Button(() => {
            spriteEditor.redo();
            canvas.vibrate(50);
        });
        nextButton.text = '>';
        ui.appendChild(nextButton);
        const clearButton = new Button(() => {
            spriteEditor.empty();
            canvas.vibrate(50);
        });
        clearButton.text = 'X';
        ui.appendChild(clearButton);
        const download = new Button(() => {
            canvas.saveFile(spriteEditor.save(), 'sprite.jsbx', 'application/octet-stream');
            canvas.vibrate(50);
        });
        download.text = 'download';
        ui.appendChild(download);

        const open = new Input('file');
        open.element.addEventListener('input', (e) => {
            if (open.element.files.length > 0) {
                const file = open.element.files[0];
                file.arrayBuffer().then((b) => {
                    spriteEditor.load(b);
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
        function addBoxel(e) {
            if (canDraw) {
                const ray = camera.raycast(canvas.getNormalizedPointerPosition(e).toVector3());
                const result = mode === 2 ?
                    spriteEditor.write(ray)
                    : spriteEditor.write(ray, ui.color, mode === 0);
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
                const ray = camera.raycast(canvas.getNormalizedPointerPosition(e).toVector3());
                const result = spriteEditor.read(ray);
                if (result) {
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
                                addBoxel(e);
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
                        addBoxel(e);
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
                addBoxel(e);
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

            const scale = renderTarget.maxY * 0.5;

            if (camera.top != scale) {
                camera.top = scale;
                camera.translate(new Vector3(-previousScale, -previousScale, +previousScale)).translate(new Vector3(scale, scale, -scale));
                previousScale = scale;
            }
            if (zoom) {
                camera.zoom += zoom;
                updateGrid = true;
                zoom = 0;
            }
            if (camera.zoom > scale) {
                camera.zoom = scale;
            } else if (camera.zoom < 6) {
                camera.zoom = 6;
            }
            if (updateGrid) {
                grid.fading = scale / camera.zoom * 4;
                updateGrid = false;
            }
            let cameraTranslation = new Vector3();
            if (cameraMovement[0]) {
                cameraTranslation.add(camera.xAxis.scale(cameraMovement[0]));
            }
            if (cameraMovement[1]) {
                cameraTranslation.add(camera.yAxis.scale(cameraMovement[1]));
            }
            if (cameraTranslation[0] || cameraTranslation[2]) {
                camera.translate(cameraTranslation);
                cameraMovement.empty();
            }

            let orbitTranslation = new Vector3();
            if (orbitMovement[0]) {
                orbitTranslation.add(camera.xAxis.scale(orbitMovement[0] / camera.zoom));
            }
            if (orbitMovement[1]) {
                orbitTranslation.add(camera.yAxis.scale(orbitMovement[1] / camera.zoom));
            }
            if (orbitTranslation[0] || orbitTranslation[2]) {
                orbit.translate(orbitTranslation);
                orbitMovement.empty();
            }
            this.canvas.render(camera);
        }
    }
}