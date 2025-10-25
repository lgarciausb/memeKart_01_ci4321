import * as t from "three"

class Mushroom {
    ms : t.Group
    status : string = "stored"
    angle : number = 0
    msStem: t.Mesh<t.CylinderGeometry, t.MeshStandardMaterial, t.Object3DEventMap>
    msCap: t.Mesh<t.CylinderGeometry, t.MeshStandardMaterial, t.Object3DEventMap>
    msCapTop: t.Mesh<t.SphereGeometry, t.MeshStandardMaterial, t.Object3DEventMap>

    constructor(scene: t.Scene) {

        this.msStem = new t.Mesh(
            new t.CylinderGeometry(2, 2, 6),
            new t.MeshStandardMaterial({color:0xdddddd, transparent:true})
        )

        this.msCap = new t.Mesh(
            new t.CylinderGeometry(6, 6, 2),
            new t.MeshStandardMaterial({color:0xff0000, transparent:true})
        )
        this.msCapTop = new t.Mesh(
            new t.SphereGeometry(6, 32, 16, 0, Math.PI),
            new t.MeshStandardMaterial({color:0xff0000, transparent:true})
        )
        this.msCap.position.y = 6
        this.msCapTop.position.y = 7
        this.msCapTop.rotation.x = 3*Math.PI/2

        this.ms = new t.Group()
        this.ms.add(this.msStem, this.msCap, this.msCapTop)

        this.ms.position.y = 10

        scene.add(this.ms)


    }

}

export { Mushroom }