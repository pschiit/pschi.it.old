import Color from '../core/Color';
import Matrix4 from '../math/Matrix4';
import Vector3 from '../math/Vector3';
import Material from '../renderer/graphics/Material';
import Render from '../renderer/graphics/Render';

export default class Node3d extends Render {
    /** Create a new Node3d
    */
    constructor() {
        super();
        const colorId = Node3d.generateColorId(this);
        this.setParameter(Material.parameters.colorId, colorId);
        this.matrix = Matrix4.identityMatrix();
        this._target = new Vector3();
        this.castShadow = false;
        this.receiveShadow = false;
    }

    get vertexMatrix() {
        if(!this.parameters[Material.parameters.vertexMatrix]){
            const parentMatrix = this.parent?.vertexMatrix;
            const vertexMatrix = parentMatrix instanceof Matrix4 ? parentMatrix.clone().multiply(this.matrix)
                : this.matrix.clone();
            this.setParameter(Material.parameters.vertexMatrix, vertexMatrix);
        }
        return this.parameters[Material.parameters.vertexMatrix];
    }

    get normalMatrix() {
        return this.parameters[Material.parameters.normalMatrix];
    }

    /** Return a Vector3 reflecting the x axis from the current Node3d
     * @return {Vector3} x axis vector
    */
    get xAxis() {
        return this.matrix.xAxis;
    }

    /** Return a Vector3 reflecting the y axis from the current Node3d
     * @return {Vector3} y axis vector
    */
    get yAxis() {
        return this.matrix.yAxis;
    }
    /** Return a Vector3 reflecting the z axis from the current Node3d
     * @return {Vector3} z axis vector
    */
    get zAxis() {
        return this.matrix.zAxis;
    }

    /** Return a Vector3 reflecting the position of the current Node3d
     * @return {Vector3} scale vector
    */
    get position() {
        return this.matrix.positionVector;
    }

    /** Set the Node3d position 
     * @return {Vector3} position vector
    */
    set position(v) {
        this.matrix.positionVector = v;
        this.clearVertexMatrix();
    }

    /** Return a Vector3 reflecting the scale of the current Node3d
     * @return {Vector3} scale vector
    */
    get scale() {
        return this.matrix.scaleVector;
    }

    /** Return the Vector3 target direction of the current Node3d from the world perspective
     * @return {Vector3} node Vector3 target direction
    */
    get target() {
        return this._target;
    }

    /** Set the target direction of the current Node3d from the world perspective
     * @param {Vector3} v Vector3 target direction
    */
    set target(v) {
        this._target = v;
        this.matrix.target(this._target);
        this.clearVertexMatrix();
    }

    /** Return the Matrix4 of the current Node3d
     * @return {Matrix4} node Matrix4
    */
    get matrix() {
        return this._matrix;
    }

    /** Set the Matrix4 of the current Node3d
     * @param {Matrix4} v Matrix4
    */
    set matrix(v) {
        this._matrix = v;
        this.clearVertexMatrix();
    }

    /** Translate the Node3d by a Vector3 array
     * @param {Number|Vector3} x first coordinate of the  Vector3
     * @param {Number} y second coordinate of the  Vector3
     * @param {Number} z third coordinate of the  Vector3
     * @return the current Node3d
    */
    translate(x = 0, y = 0, z = 0) {
        this.matrix.translate(x instanceof Vector3 ? x : new Vector3(x, y, z));
        this.clearVertexMatrix();

        return this;
    }

    /** Rescale the Node3d by a Vector3 array
     * @param {Number|Vector3} x first coordinate of the  Vector3
     * @param {Number} y second coordinate of the  Vector3
     * @param {Number} z third coordinate of the  Vector3
     * @return the current Node3d
    */
    rescale(x = 0, y = 0, z = 0) {
        this.matrix.scale(x instanceof Vector3 ? x : new Vector3(x, y, z));
        this.clearVertexMatrix();

        return this;
    }

    /** Rotate the Node3d by a Vector3 array
     * @param {Number} radians angle in radians of the rotation
     * @param {Number|Vector3} x first coordinate of the  Vector3
     * @param {Number} y second coordinate of the  Vector3
     * @param {Number} z third coordinate of the  Vector3
     * @return the current Node3d
    */
    rotate(radians, x = 0, y = 0, z = 0) {
        this.matrix.rotate(radians, x instanceof Vector3 ? x : new Vector3(x, y, z));
        this.clearVertexMatrix();

        return this;
    }

    /** Transform the Node3d matrix with a Matrix4
     * @param {Matrix4} matrix 
     * @return the current Node3d
    */
    transform(matrix) {
        this.matrix.multiply(matrix);
        this.clearVertexMatrix();

        return this;
    }

    clearVertexMatrix(){
        this.dispatchCallback(()=>{
            if(this.vertexMatrix){
                this.parameters[Material.parameters.vertexMatrix] = null;
            }
        });
    }
    
    intersect(ray){
        return null;
    }

    setScene(parameters) {
        if (this.vertexMatrix) {
            this.setParameter(Material.parameters.normalMatrix, this.vertexMatrix.inverse.transpose());
        }
    }

    static search(colorId) {
        return cache[colorId];
    }
    static generateColorId(node) {
        do {
            const color = Color.random();
            if (!cache[color]) {
                cache[color] = node;
                return color;
            }
        } while (true);
    }

    static parameters = {
    }
}
const cache = {};