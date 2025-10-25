import * as t from "three"

class Shell {
    shell : t.Mesh
    status : string = "stored"
    v : number[] = [0,0,0] 
    angle : number = 0
    bounces : number = 0

    constructor(scene: t.Scene) {

        const geometry = new t.BufferGeometry();
        // create a simple square shape. We duplicate the top left and bottom right
        // vertices because each vertex needs to appear once per triangle.
        const vertices = new Float32Array( [
            -10, 0, 0,
            -2.5, 0, 2.5,
            -2.5, 0, -2.5,
            
            -2.5, 0, 2.5,
            0, 0, 10,
            2.5, 0, 2.5,
            
            2.5, 0, 2.5,
            10, 0, 0,
            2.5, 0, -2.5,
            
            2.5, 0, -2.5,
            0, 0, -10,
            -2.5, 0, -2.5,

            -10, 0, 0,
            -2.5, 0, 2.5,
            0,2.5,0,

            -10, 0, 0,
            -2.5, 0, -2.5,
            0,2.5,0,

            10, 0, 0,
            2.5, 0, -2.5,
            0,2.5,0,

            10, 0, 0,
            2.5, 0, 2.5,
            0,2.5,0,

            0, 0, 10,
            -2.5, 0, 2.5,
            0,2.5,0,

            0, 0, 10,
            2.5, 0, 2.5,
            0,2.5,0,

            0, 0, -10,
            2.5, 0, -2.5,
            0,2.5,0,

            0, 0, -10,
            -2.5, 0, -2.5,
            0,2.5,0,
            
        ] );

        // itemSize = 3 because there are 3 values (components) per vertex
        geometry.setAttribute( 'position', new t.BufferAttribute( vertices, 3 ) );
        const material = new t.MeshStandardMaterial( { color: 0x008080 } );
        this.shell = new t.Mesh( geometry, material );

        this.shell.position.y = 5
        this.shell.geometry.computeBoundingBox()
        geometry.computeVertexNormals();

        scene.add(this.shell)

    }

}

export { Shell }