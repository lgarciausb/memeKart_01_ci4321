import * as t from "three"

class ItemBox {
    box : t.Mesh

    constructor(scene: t.Scene, x : number, z : number) {

        this.box = new t.Mesh(
            new t.BoxGeometry(20, 20, 20),
            new t.MeshStandardMaterial({color:0xa67c00})
        )

        this.box.position.y = 20
        this.box.position.x = x
        this.box.position.z = z

        this.box.rotateX(Math.PI/4)
        this.box.rotateY(Math.PI/4)

        this.box.geometry.computeBoundingBox()

        scene.add(this.box)

    }

    move() {
        this.box.rotateOnWorldAxis(new t.Vector3(0, 1, 0), 0.01) 
    }
}

export { ItemBox }