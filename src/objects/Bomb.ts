import * as t from "three"

class Bomb {
    bomb : t.Group
    bombBody : t.Mesh
    bombWick : t.Mesh
    status : string = "stored"
    v : number[] = [0,0,0] 

    constructor(scene: t.Scene) {

        this.bombBody = new t.Mesh(
            new t.SphereGeometry(10),
            new t.MeshStandardMaterial({color:0x666666, transparent:true})
        )

        this.bombWick = new t.Mesh(
            new t.CylinderGeometry(3, 3, 4),
            new t.MeshStandardMaterial({color:0x666666, transparent:true})
        )
        this.bombWick.position.y = 10

        this.bomb = new t.Group()
        this.bomb.add(this.bombBody, this.bombWick)

        this.bomb.position.y = 10

        this.bombBody.geometry.computeBoundingBox()

        scene.add(this.bomb)

    }

}

export { Bomb }