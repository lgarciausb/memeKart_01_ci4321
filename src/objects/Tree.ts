import * as t from "three"

class Tree {
    tree : t.Group
    leaves : t.Mesh
    trunk : t.Mesh
    constructor(scene : t.Scene, x:number, z:number) {

        this.trunk = new t.Mesh(
            new t.BoxGeometry(20, 80, 20),
            new t.MeshStandardMaterial({color:0x964B00})
        )
        this.trunk.translateY(40)

        this.leaves = new t.Mesh(
            new t.BoxGeometry(60, 30, 60),
            new t.MeshStandardMaterial({color:0x136d15})
        )
        this.leaves.translateY(80)

        this.tree = new t.Group()

        this.tree.add(this.trunk, this.leaves)

        this.tree.position.x = x 
        this.tree.position.z = z

        this.trunk.geometry.computeBoundingBox()
        this.leaves.geometry.computeBoundingBox()

        scene.add(this.tree)
    }
    
}

export { Tree }