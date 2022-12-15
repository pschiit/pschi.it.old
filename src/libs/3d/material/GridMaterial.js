import Color from '../../core/Color';
import Vector2 from '../../math/Vector2';
import Material from '../../renderer/graphics/Material';

export default class GridMaterial extends Material {
    constructor(color = Color.white, sizes = new Vector2(1, 10), distance = 100, axes = 'xzy') {
        super();
        this.color = color;
        this.sizes = sizes;
        this.distance = distance;
        this.axes = axes;
        this.culling = null;
    }

    get distance() {
        return this.parameters[GridMaterial.distanceName];
    }

    set distance(v) {
        this.setParameter(GridMaterial.distanceName, v);
    }

    get sizes() {
        return this.parameters[GridMaterial.sizesName];
    }

    set sizes(v) {
        this.setParameter(GridMaterial.sizesName, v);
    }

    get color() {
        return this.parameters[GridMaterial.colorName];
    }

    set color(v) {
        this.setParameter(GridMaterial.colorName, v);
    }

    static distanceName = "gridDistance";
    static sizesName = "gridSizes";
    static colorName = "gridColor";
}