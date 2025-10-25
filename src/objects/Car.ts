import * as t from "three"
import { Bomb } from "./Bomb"

class Car {
    chasis : t.Mesh
    cabin : t.Mesh
    wheels : t.Mesh[]
    geometries : t.Mesh[]
    camera : t.Camera
    cameraType : number = 0

    items : Bomb[] = []

    a : number = 0
    v : number = 0
    maxV : number = 10 
    r : number = 0
    dir : number = 0

    constructor(scene: t.Scene, camera: t.Camera, color : number) {

        this.chasis = new t.Mesh(
            new t.BoxGeometry(16, 9, 42),
            new t.MeshStandardMaterial({color:color})
        )
        this.cabin = new t.Mesh(
            new t.BoxGeometry(16, 6, 14),
            new t.MeshStandardMaterial({color:color})
        )
        this.cabin.position.set(0, 4.5, 4)

        this.wheels = Array(4).fill(0).map(_=> new t.Mesh(
            new t.CylinderGeometry(6, 6, 4, 8, 5),
            new t.MeshStandardMaterial({color:0x333333})
        ))
        this.wheels.forEach(x=>x.rotation.z = Math.PI/2)
        //this.wheels.forEach((x,i)=> {if (i < 2) x.rotation.y = Math.PI/16})
        this.wheels.forEach((x,i)=>{
            x.position.x = 10 * Math.pow(-1, i)
            x.position.z = -11
            if (i > 1) x.position.z = 11
        })

        this.geometries = [this.chasis, this.cabin, ...this.wheels]
        this.geometries.forEach(x=>x.position.y += 6)

        this.chasis.geometry.computeBoundingBox()
    
        scene.add(this.chasis, this.cabin)
        this.wheels.forEach(x=>scene.add(x))

        this.camera = camera
        this.moveCamera()
    }

    moveCamera() {
        if (this.cameraType == 0) {
            this.camera.position.set(
                this.chasis.position.x + 80*Math.sin(this.chasis.rotation.y), 
                this.chasis.position.y + 40,
                this.chasis.position.z + 80*Math.cos(this.chasis.rotation.y)
            )
            this.camera.rotation.x = this.camera.rotation.z = 0
            this.camera.rotation.y = this.chasis.rotation.y
            this.camera.rotateX(-0.392699082)
        }
        else if (this.cameraType == 1) {
            this.camera.position.set(
                this.chasis.position.x + -8*Math.sin(this.chasis.rotation.y), 
                this.chasis.position.y + 12,
                this.chasis.position.z + -8*Math.cos(this.chasis.rotation.y)
            )
            this.camera.rotation.x = this.camera.rotation.z = 0
            this.camera.rotation.y = this.chasis.rotation.y
        }
        else if (this.cameraType == 2) {
            this.camera.position.set(
                this.chasis.position.x + 80*Math.sin(this.chasis.rotation.y+Math.PI), 
                this.chasis.position.y + 40,
                this.chasis.position.z + 80*Math.cos(this.chasis.rotation.y+Math.PI)
            )
            this.camera.rotation.x = this.camera.rotation.z = 0
            this.camera.rotation.y = this.chasis.rotation.y+Math.PI
            this.camera.rotateX(-0.392699082)
        }
        
        
    }

    rotate() {
        
        const r = this.r
        
        this.chasis.rotation.y += r
        this.cabin.rotateY(r)
        this.cabin.position.set(
            this.chasis.position.x + 4*Math.sin(this.chasis.rotation.y), 
            this.cabin.position.y, 
            this.chasis.position.z + 4*Math.cos(this.chasis.rotation.y)
        )

        if (Math.sign(this.dir) !== Math.sign(r)) {
            const sign = Math.sign(r) - Math.sign(this.dir)
            this.dir = Math.sign(r)
            this.wheels.forEach((w,i)=>{
                w.rotateOnWorldAxis(new t.Vector3(0, 1, 0), sign*Math.PI/32)
                //if (i < 2)  else w.rotation.y += sign*Math.PI/32
            })
        } 
        const H = 14.866068747318506
        this.wheels.forEach((w,i)=>{
            const x = 10 * Math.pow(-1, i)
            let z = -11
            if (i > 1) z = 11
            const a = Math.atan2(x,z)
            w.rotateOnWorldAxis(new t.Vector3(0, 1, 0), r)
            w.position.set(
                this.chasis.position.x + H*Math.sin(this.chasis.rotation.y+a), 
                w.position.y, 
                this.chasis.position.z + H*Math.cos(this.chasis.rotation.y+a)
            )
        })

        this.moveCamera()
    }
    move() {
        this.v += this.a + ((this.a === 0 && this.v !==0) ? -Math.min(0.0035, Math.abs(this.v))*Math.sign(this.v) : 0) 
        if (Math.abs(this.v) > this.maxV) this.v = this.maxV*Math.abs(this.v)/this.v

        const dx = this.v*Math.sin(this.chasis.rotation.y)
        const dz = this.v*Math.cos(this.chasis.rotation.y)
        this.geometries.forEach(x=>{
            x.position.set(
                x.position.x + dx,
                x.position.y, 
                x.position.z + dz
            )
        })
        if (this.v != 0) {
            const angle = this.v/(this.wheels[0].geometry as t.CylinderGeometry).parameters.radiusTop
            this.wheels.forEach(w=> w.rotateY( -angle))
        }
        this.moveCamera()
        
    }   
}

export { Car }