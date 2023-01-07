import Color from '../../../libs/core/Color';
import Vector2 from '../../../libs/math/Vector2';
import Material from '../../../libs/renderer/graphics/Material';
import Operation from '../../../libs/renderer/graphics/shader/Operation';
import Parameter from '../../../libs/renderer/graphics/shader/Parameter';
import Shader from '../../../libs/renderer/graphics/shader/Shader';
import ShaderFunction from '../../../libs/renderer/graphics/shader/ShaderFunction';

export default class BoxelGridMaterial extends Material {
    constructor() {
        super();
        this.depth = Material.depth.less;

        this.setParameter(Material.parameters.cameraPosition);
        this.setParameter(Material.parameters.cameraTarget);
        this.setParameter(Material.parameters.projectionMatrix);

        this.color = Color.black();
        this.sizes = new Vector2(1, 10);
        this.distance = 1000;
        this.axes = 'xzy';
        this.fading = 25;

        const planeAxes = '.' +  this.axes.substring(0, 2);

        const position = Parameter.vector3('pos');
        const vPosition = Parameter.vector3('v_' + Material.parameters.position, Parameter.qualifier.out);

        this.vertexShader = Shader.vertexShader([
            Operation.equal(
                Operation.declare(position),
                Operation.multiply(
                    Operation.selection(Material.parameters.position, '.' + this.axes),
                    BoxelGridMaterial.parameters.distance)),
            Operation.addTo(
                Operation.selection(position, planeAxes),
                Operation.selection(Material.parameters.cameraPosition, planeAxes)),
            Operation.equal(
                Shader.parameters.output,
                Operation.multiply(
                    Material.parameters.projectionMatrix,
                    Material.parameters.vertexMatrix,
                    Operation.toVector4(position, 1))),
            Operation.equal(
                vPosition,
                position)]);


        const r = Parameter.vector2('r');
        const grid = Parameter.vector2('grid');
        const line = Parameter.number('line');

        const viewPosition = Parameter.vector3('viewPosition');
        const d = Parameter.number('d');
        const g1 = Parameter.number('g1');
        const g2 = Parameter.number('g2');

        const outputAlpha = Operation.selection(Shader.parameters.output, '.a');
        const planeAxesSelection = Operation.selection(vPosition, planeAxes);


        const size = Parameter.number('size');
        const getGrid = new ShaderFunction(
            'getGrid',
            Number,
            size,
            [
                Operation.equal(
                    Operation.declare(r),
                    Operation.divide(
                        planeAxesSelection,
                        size
                    )
                ),
                Operation.equal(
                    Operation.declare(grid),
                    Operation.divide(
                        Operation.abs(
                            Operation.substract(
                                Operation.fract(Operation.substract(r, 0.5)),
                                0.5
                            ),
                        ),
                        Operation.fWidth(
                            r
                        ),
                    )
                ),
                Operation.equal(
                    Operation.declare(line),
                    Operation.min(
                        Operation.selection(grid, '.x'),
                        Operation.selection(grid, '.y'),
                    ),
                ),
                Operation.return(
                    Operation.substract(1, Operation.min(line, 1))
                ),
            ]);
        const x = Operation.selection(viewPosition, '.x');
        const y = Operation.selection(viewPosition, '.y');

        this.fragmentShader = Shader.fragmentShader([
            Operation.equal(
                Operation.declare(viewPosition),
                Operation.normalize(
                    Operation.substract(
                        Material.parameters.cameraPosition,
                        vPosition
                    )
                )
            ),
            Operation.equal(
                Operation.declare(d),
                Operation.substract(
                    1,
                    Operation.divide(
                        Operation.len(
                            Operation.substract(
                                planeAxesSelection,
                                Operation.selection(
                                    Material.parameters.cameraTarget,
                                    planeAxes
                                )
                            )
                        ),
                        BoxelGridMaterial.parameters.fading,
                    )
                )
            ),
            Operation.equal(
                Operation.declare(g1),
                Operation.do(
                    getGrid,
                    Operation.selection(BoxelGridMaterial.parameters.sizes, '.x'))
            ),
            Operation.equal(
                Operation.declare(g2),
                Operation.do(
                    getGrid,
                    Operation.selection(BoxelGridMaterial.parameters.sizes, '.y'))
            ),
            Operation.equal(
                Shader.parameters.output,
                Operation.toVector4(
                    BoxelGridMaterial.parameters.color,
                    Operation.multiply(
                        Operation.mix(g2, g1, g1),
                        Operation.pow(d,3))),
            ),
            Operation.equal(
                outputAlpha,
                Operation.mix(
                    Operation.multiply(0.5, outputAlpha),
                    outputAlpha,
                    g2
                )),
            Operation.if(
                Operation.lessEquals(
                    outputAlpha,
                    0
                ),
                Operation.discard()
            ),
            Material.operation.gammaCorrection],
            Shader.precision.high);
    }

    get distance() {
        return this.getParameter(BoxelGridMaterial.parameters.distance);
    }

    set distance(v) {
        this.setParameter(BoxelGridMaterial.parameters.distance, v);
    }

    get sizes() {
        return this.getParameter(BoxelGridMaterial.parameters.sizes);
    }

    set sizes(v) {
        this.setParameter(BoxelGridMaterial.parameters.sizes, v);
    }

    get color() {
        return this.getParameter(BoxelGridMaterial.parameters.color);
    }

    set color(v) {
        this.setParameter(BoxelGridMaterial.parameters.color, v);
    }

    get fading() {
        return this.getParameter(BoxelGridMaterial.parameters.fading);
    }

    set fading(v) {
        this.setParameter(BoxelGridMaterial.parameters.fading, v);
    }

    static parameters = {
        distance: Parameter.number('gridDistance', Parameter.qualifier.const),
        sizes: Parameter.vector2('gridSizes', Parameter.qualifier.const),
        color: Parameter.vector3('gridColor', Parameter.qualifier.const),
        fading: Parameter.number('gridFading', Parameter.qualifier.const),
    };
}