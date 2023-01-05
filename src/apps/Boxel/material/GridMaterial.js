import Color from '../../../libs/core/Color';
import Vector2 from '../../../libs/math/Vector2';
import Material from '../../../libs/renderer/graphics/Material';
import Operation from '../../../libs/renderer/graphics/shader/Operation';
import Parameter from '../../../libs/renderer/graphics/shader/Parameter';
import Shader from '../../../libs/renderer/graphics/shader/Shader';
import ShaderFunction from '../../../libs/renderer/graphics/shader/ShaderFunction';

export default class GridMaterial extends Material {
    constructor() {
        super();

        this.setParameter(Material.parameters.cameraPosition);
        this.setParameter(Material.parameters.projectionMatrix);

        this.color = Color.white.clone().scale(0.5);
        this.sizes = new Vector2(1, 10);
        this.distance = 10000;
        this.axes = 'xzy';

        const planeAxes = this.axes.substring(0, 2);

        const position = Parameter.vector3('pos');
        const vPosition = Parameter.vector3('v_' + Material.parameters.position, Parameter.qualifier.out);

        this.vertexShader = Shader.vertexShader([
            Operation.equal(
                Operation.declare(position),
                Operation.multiply(
                    Operation.selection(Material.parameters.position, '.' + this.axes),
                    GridMaterial.parameters.distance)),
            Operation.addTo(
                Operation.selection(position, '.' + planeAxes),
                Operation.selection(Material.parameters.cameraPosition, '.' + planeAxes)),
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
        const planeAxesSelection = Operation.selection(vPosition, '.' + planeAxes);


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
                                Operation.fract(Operation.substract(r, 1)),
                                1
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
                    Operation.min(
                        Operation.distance(
                            Operation.selection(viewPosition, '.' + planeAxes),
                            Operation.divide(
                                planeAxesSelection,
                                GridMaterial.parameters.distance
                            ),
                        ),
                        1
                    )
                )
            ),
            Operation.equal(
                Operation.declare(g1),
                Operation.do(
                    getGrid,
                    Operation.selection(GridMaterial.parameters.sizes, '.x'))
            ),
            Operation.equal(
                Operation.declare(g2),
                Operation.do(
                    getGrid,
                    Operation.selection(GridMaterial.parameters.sizes, '.y'))
            ),
            Operation.equal(
                Shader.parameters.output,
                Operation.toVector4(
                    GridMaterial.parameters.color,
                    Operation.multiply(Operation.mix(g2, g1, g1), 
                    Operation.pow(d,2))),
            ),
            Operation.equal(
                outputAlpha,
                Operation.mix(
                    Operation.multiply(0.5, outputAlpha),
                    outputAlpha,
                    g2
                ),),
            Operation.if(
                Operation.lessEquals(
                    outputAlpha,
                    0
                ),
                Operation.discard()
            )],
            Shader.precision.high);
    }

    get distance() {
        return this.getParameter(GridMaterial.parameters.distance);
    }

    set distance(v) {
        this.setParameter(GridMaterial.parameters.distance, v);
    }

    get sizes() {
        return this.getParameter(GridMaterial.parameters.sizes);
    }

    set sizes(v) {
        this.setParameter(GridMaterial.parameters.sizes, v);
    }

    get color() {
        return this.getParameter(GridMaterial.parameters.color);
    }

    set color(v) {
        this.setParameter(GridMaterial.parameters.color, v);
    }

    static parameters = {
        distance: Parameter.number('gridDistance', Parameter.qualifier.const),
        sizes: Parameter.vector2('gridSizes', Parameter.qualifier.const),
        color: Parameter.vector3('gridColor', Parameter.qualifier.const),
    };
}