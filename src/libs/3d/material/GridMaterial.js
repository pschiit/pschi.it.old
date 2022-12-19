import Color from '../../core/Color';
import Vector2 from '../../math/Vector2';
import Material from '../../renderer/graphics/Material';
import Conversion from '../../renderer/graphics/shader/Conversion';
import Operation from '../../renderer/graphics/shader/Operation';
import Parameter from '../../renderer/graphics/shader/Parameter';
import Shader from '../../renderer/graphics/shader/Shader';
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

        // vec3 pos = ${position}.${this.axes} * ${gridDistance};
        // pos.${planeAxes} += ${cameraPosition}.${planeAxes};
        // gl_Position = ${cameraMatrix} * ${vertexMatrix} * vec4(pos, 1.0);
        // ${vPosition} = pos;
        
        const position = Parameter.vector4('pos');
        const selection = null;//Selection(position, this.axes);
        const positionEqual = Operation.equal(
            position, 
            Operation.multiply(selection, GridMaterial.parameters.distance));

        const conversionPosition = Conversion.toVector4(position, 1);
        const vertexOutput = Operation.equal(
            Shader.parameters.output, 
            Operation.multiply(CameraNode.parameters.projectionMatrix, Node3d.parameters.vertexMatrix, conversionPosition));
        this.vertexShader = Shader.vertexShader([positionEqual,vertexOutput]);

        const conversion = Conversion.toVector4(GridMaterial.parameters.color, 1);
        const fragmentOutput = Operation.equal(Shader.parameters.output, conversion);
        this.fragmentShader = Shader.fragmentShader([fragmentOutput]);
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