import Buffer from '../../core/Buffer';

export default class VertexBufferManager {
    constructor(){
        this.buffer = new Buffer();
        this.instanceBuffer = new Buffer();
        this.indexBuffer = new Buffer();
    }

    add(vertexBuffer){
        const buffers = vertexBuffer.arrayBuffer;
        if(buffers){
            this.buffer.appendChild(buffers);
        }
        const index = vertexBuffer.index;
        if(index){
            this.indexBuffer.appendChild(index);
        }
        const instanceBuffers = vertexBuffer.instanceArrayBuffer;
        if(instanceBuffers){
            this.instanceBuffer.appendChild(instanceBuffers);
        }
    }
}