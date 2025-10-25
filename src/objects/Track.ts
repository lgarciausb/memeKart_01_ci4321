import * as t from "three"
import {Tree, ItemBox} from "./objects"

class Track {
    floor : t.Mesh
    forest : Tree[] = []
    nTrees: number = 100
    boxes : ItemBox[]
    nBoxes : number = 100
    walls : t.Mesh[] = []
    width : number = 5000
    depth : number = 5000
    constructor(scene : t.Scene) {

        this.floor = new t.Mesh(
            new t.BoxGeometry(this.width, 10, this.depth),
            new t.MeshStandardMaterial({color:0x136d15})
        )
        this.floor.position.y -= 5

        //walls
        for (let i = 0; i<4;i++) {

            const width = (i%2) ? this.width : 10
            const depth = (i%2)? 10 : this.depth
            const wall = new t.Mesh(
                new t.BoxGeometry(width, 1000, depth),
                new t.MeshStandardMaterial({color:0x136d15, transparent:true, opacity:0})
            )
            const dx = (i%2) ? 0 : this.width/2
            const dz = (i%2) ? this.depth/2 : 0

            wall.position.x = dx*((i<2) ? 1 : -1)
            wall.position.z = dz*((i<2) ? 1 : -1)

            wall.geometry.computeBoundingBox()
            this.walls.push(wall)
        }

        //trees
        for (let i = 0; i<this.nTrees;i++) this.forest.push(new Tree(
            scene, 
            t.MathUtils.randFloatSpread(this.width),
            t.MathUtils.randFloatSpread(this.depth)
        ))

        //item boxes

        this.boxes = Array(this.nBoxes).fill(0).map(_=>new ItemBox(
            scene,
            t.MathUtils.randFloatSpread(this.width),
            t.MathUtils.randFloatSpread(this.depth)

        ))

        scene.add(this.floor, ...this.forest.map(x=>x.tree), ...this.walls)
    }
    
}

export { Track }