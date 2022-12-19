import Color from '../../core/Color';
import Vector2 from '../../math/Vector2';
import Material from '../../renderer/graphics/Material';
import Operation from '../../renderer/graphics/shader/Operation';
import Parameter from '../../renderer/graphics/shader/Parameter';
import Shader from '../../renderer/graphics/shader/Shader';
import ShaderFunction from '../../renderer/graphics/shader/ShaderFunction';
import VertexBuffer from '../../renderer/graphics/VertexBuffer';
import CameraNode from '../camera/CameraNode';
import Node3d from '../Node3d';

export default class GridMaterial extends Material {
    constructor(color = Color.white, sizes = new Vector2(1, 10), distance = 100, axes = 'xzy') {
        super();
        this.color = color;
        this.sizes = sizes;
        this.distance = distance;
        this.axes = axes;
        this.culling = null;

        const planeAxes = this.axes.substring(0, 2);

        const position = Parameter.vector3('pos');
        const vPosition = Parameter.vector3('v_' + VertexBuffer.parameters.position, Parameter.qualifier.var);

        this.vertexShader = Shader.vertexShader([
            Operation.equal(
                position,
                Operation.multiply(
                    Operation.selection(VertexBuffer.parameters.position, this.axes),
                    GridMaterial.parameters.distance)),
            Operation.addTo(
                Operation.selection(position, planeAxes),
                Operation.selection(CameraNode.parameters.cameraPosition, planeAxes)),
            Operation.equal(
                Shader.parameters.output,
                Operation.multiply(
                    CameraNode.parameters.projectionMatrix,
                    Node3d.parameters.vertexMatrix,
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

        const outputAlpha = Operation.selection(Shader.parameters.output, 'a');
        const planeAxesSelection = Operation.selection(vPosition, planeAxes);
        

        const size = Parameter.number('size');
        const getGrid = new ShaderFunction(
            'getGrid',
            Number,
            size,
            [
                Operation.equal(
                    r,
                    Operation.divide(
                        planeAxesSelection,
                        size
                    )
                ),
                Operation.equal(
                    grid,
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
                    line,
                    Operation.min(
                        Operation.selection(grid, 'x'),
                        Operation.selection(grid, 'y'),
                    ),
                ),
                Operation.return(
                    Operation.substract(1, Operation.min(line, 1))
                ),
            ]);

        this.fragmentShader = Shader.fragmentShader([
            Operation.equal(
                viewPosition,
                Operation.normalize(
                    Operation.substract(
                        CameraNode.parameters.cameraPosition,
                        vPosition
                    )
                )
            ),
            Operation.equal(
                d,
                Operation.substract(
                    1,
                    Operation.min(
                        Operation.distance(
                            Operation.selection(viewPosition, planeAxes),
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
                g1,
                Operation.do(
                    getGrid,
                    Operation.selection(GridMaterial.parameters.sizes, 'x'))
            ),
            Operation.equal(
                g2,
                Operation.do(
                    getGrid,
                    Operation.selection(GridMaterial.parameters.sizes, 'y'))
            ),
            Operation.equal(
                Shader.parameters.output,
                Operation.toVector4(
                    GridMaterial.parameters.color,
                    Operation.multiply(
                        Operation.mix(g2, g1, g1),
                        Operation.pow(d, 3)
                    )),
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
        return this.parameters[GridMaterial.parameters.distance];
    }

    set distance(v) {
        this.setParameter(GridMaterial.parameters.distance, v);
    }

    get sizes() {
        return this.parameters[GridMaterial.parameters.sizes];
    }

    set sizes(v) {
        this.setParameter(GridMaterial.parameters.sizes, v);
    }

    get color() {
        return this.parameters[GridMaterial.parameters.color];
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