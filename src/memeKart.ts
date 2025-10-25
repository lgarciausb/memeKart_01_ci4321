import * as t from "three"
import * as OBJECTS from "./objects/objects"

class memeKart {
    
    renderer: t.WebGLRenderer

    scene : t.Scene

    camera : t.PerspectiveCamera
    player : OBJECTS.Car
    track : OBJECTS.Track
    items : (OBJECTS.Bomb | OBJECTS.Shell | OBJECTS.Mushroom)[]  = []
    

    pressedKeys = {d:false, a: false, w: false, s: false}

    //initialize game
    constructor() {

        //initialize three.js params

        this.renderer = new t.WebGLRenderer({
            canvas : document.querySelector("#cnv") as HTMLCanvasElement
        })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth,window.innerHeight)

        this.scene = new t.Scene()
        const sky = new t.TextureLoader().load("/17576286_xl.png")
        this.scene.background = sky

        //objects
        this.camera = new t.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
        this.player = new OBJECTS.Car(this.scene, this.camera, 0xFF69B4)
        this.track = new OBJECTS.Track(this.scene) //initializes trees and itemBoxes

        const light = new t.DirectionalLight( 0xffffff, 10 );
        light.position.set(-10, 10, 5); 
        light.target.position.set(0, 0, 0);
        this.scene.add(light)

        //set input event handlers
        this.inputHandler()

    }

    inputHandler() {
        const handleKeyDown = (event:KeyboardEvent) => {
        switch (event.key) {
            case 'w':
            case 'W':
                this.player.a = -0.01
                this.pressedKeys.w = true
                break;
            case 's':
            case 'S':
                this.player.a = 0.01
                this.pressedKeys.s = true
                break;
            case 'a':
            case 'A':
                this.player.r = Math.PI/256
                this.pressedKeys.a = true
                break;
            case 'd':
            case 'D':
                this.player.r = -Math.PI/256
                this.pressedKeys.d = true
                break;
            }
        }
        const handleKeyUp = (event:KeyboardEvent) => {
            switch (event.key) {
                case 'w':
                case 'W':
                    this.player.a = 0
                    this.pressedKeys.w = false
                    if (this.pressedKeys.s) this.player.a = 0.01
                    break;
                case 's':
                case 'S':
                    this.player.a = 0
                    this.pressedKeys.s = false
                    if (this.pressedKeys.w) this.player.a = -0.01
                    break;
                case 'a':
                case 'A':
                    this.player.r = 0
                    this.pressedKeys.a = false
                    if (this.pressedKeys.d) this.player.r = -Math.PI/256
                    break;
                case 'd':
                case 'D':
                    this.player.r = 0
                    this.pressedKeys.d = false
                    if (this.pressedKeys.a) this.player.r = Math.PI/256
                    break;
                case 'Control':
                    this.player.cameraType = (this.player.cameraType + 1) % 3
                    break;
                case ' ':
                    this.throwItem()
                    break;
                case 'q':
                    const bomb = new OBJECTS.Bomb(this.scene)
                    this.items.push(bomb)
                    break;
                case 'e':
                    this.getShells()
                    break;
                case 'r':
                    const ms = new OBJECTS.Mushroom(this.scene)
                    this.items.push(ms)
                    break;
            }
        }
        window.addEventListener('keydown', handleKeyDown, false);
        window.addEventListener('keyup', handleKeyUp, false);
    }

    //game functions

    moveObjects() {
        //move player
        this.player.rotate()
        this.player.move()

        //move items
        this.moveItems()

        //move boxes
        this.track.boxes.forEach(box=>box.move())
    }

    moveItems() {
        const removeItems :number[] = []
        this.items.forEach((item, i) => {
            if (item instanceof OBJECTS.Bomb)
            switch (item.status) {
                case "stored":
                    item.bomb.position.set(
                        this.player.chasis.position.x + 10*Math.sin(this.player.chasis.rotation.y), 
                        item.bomb.position.y,
                        this.player.chasis.position.z + 10*Math.cos(this.player.chasis.rotation.y)
                    )
                    break;
                case "thrown":
                    item.bomb.position.set(
                        item.bomb.position.x + item.v[0], 
                        item.bomb.position.y + item.v[1],
                        item.bomb.position.z + item.v[2]
                    )

                    if (item.bomb.position.y < 10) {
                        item.bomb.position.y = 10
                        item.status = "onGround"
                        break;
                    }

                    item.v[1] -=0.01
                    break;
                case "onGround":
                    item.bomb.scale.x += 0.0075
                    item.bomb.scale.y += 0.0075
                    item.bomb.scale.z += 0.0075
                    item.bomb.children.forEach(c=>{

                        const color = ((c as t.Mesh).material as t.MeshStandardMaterial).color
                        color.r +=0.0009
                        color.g -=0.0009
                        color.b -=0.0009
                    })
                    
                    if (item.bomb.scale.x > 2) item.status = "explode"// removeItems.push(i)
                    
                    break;
                case "explode":
                    item.bomb.scale.set(5,5,5)
                        item.status = "explosion"
                        
                    item.bomb.children.forEach(c=>{
                        const color = ((c as t.Mesh).material as t.MeshStandardMaterial).color
                        color.set(1,0.46,0)
                    })
                    item.bomb.remove(item.bombWick)
                    this.scene.remove(item.bombWick)
                    item.status = "explosion"
                    break;
                case "explosion":
                    item.bomb.scale.x += 0.0022
                    item.bomb.scale.y += 0.0022
                    item.bomb.scale.z += 0.0022

                    item.bomb.children.forEach(c=>{
                        const material = ((c as t.Mesh).material as t.MeshStandardMaterial)
                        material.opacity -= 0.007
                        material.needsUpdate = true;
                    })
                    
                    if ((item.bombBody.material as t.MeshStandardMaterial).opacity <= 0) removeItems.push(i)
                    break;
            } else if (item instanceof OBJECTS.Shell) {

                switch (item.status) {
                    case "stored":
                        item.angle += Math.PI/180 + this.player.r
                        item.shell.position.set(
                            this.player.chasis.position.x + 30*Math.sin(item.angle), 
                            item.shell.position.y,
                            this.player.chasis.position.z + 30*Math.cos(item.angle)
                        )
                        item.shell.rotation.y += Math.PI/180 + this.player.r
    
                        break;
                    case "thrown":
                        item.shell.position.set(
                            item.shell.position.x + item.v[0], 
                            item.shell.position.y + item.v[1],
                            item.shell.position.z + item.v[2]
                        )
                        item.shell.rotation.y += Math.PI/30
                        break;
                }
            } else if (item instanceof OBJECTS.Mushroom) {
                switch (item.status) {
                    case "stored":
                        item.ms.position.set(
                            this.player.chasis.position.x + 30*Math.sin(this.player.chasis.rotation.y), 
                            item.ms.position.y,
                            this.player.chasis.position.z + 30*Math.cos(this.player.chasis.rotation.y)
                        )
                        break;
                    case "thrown": 
                        removeItems.push(i)
                        break;
                }
            }
        })

        removeItems.forEach(i=>{
            if (this.items[i] instanceof OBJECTS.Bomb) this.scene.remove(this.items[i].bomb)
            else if (this.items[i] instanceof OBJECTS.Shell) this.scene.remove(this.items[i].shell)
            else this.scene.remove(this.items[i].ms)
            
            this.items.splice(i,1)
        })
    }

    //COLLISION FUNCTIONS

    collision(mesh1 : t.Mesh, mesh2  : t.Mesh) : boolean {

        const box1 = mesh1.geometry.boundingBox!.clone()
        const box2 = mesh2.geometry.boundingBox!.clone()

        box1.applyMatrix4(mesh1.matrixWorld)
        box2.applyMatrix4(mesh2.matrixWorld)

        return box1.intersectsBox(box2)
    }

    handleCollisions() {
        
        const removeTree :number[]= []
        const removeItem :number[]= []
        const removeBox : number[] = []

        //tree collision
        this.track.forest.forEach((tree, i)=> {
            //with player
            if (this.collision(this.player.chasis, tree.trunk)) {
                this.player.v = 0
                if (this.player.speedUp) {
                    this.player.speedUp = undefined
                }
            }
            //with items
            this.items.forEach((item, e) => {
                if (item.status == "stored") return
                //with bomb
                if (item instanceof OBJECTS.Bomb) {
                    if (this.collision(item.bombBody, tree.trunk)||this.collision(item.bombBody, tree.leaves)) {
                        removeTree.push(i)
                        if (item.status == "thrown" || item.status == "onGround") item.status = "explode"
                    }
                //with shell
                } else if (item instanceof OBJECTS.Shell) {
                    if (this.collision(item.shell, tree.trunk)) {
                        removeTree.push(i)
                        removeItem.push(e)
                        //if (this.bounceShell(item, wall)) removeItem.push(i) //bounce mode
                    }
                }
            })
        })
        //wall collision
        this.track.walls.forEach(wall=> {
            //with player
            if (this.collision(this.player.chasis, wall)) {
                this.player.v = 0
                if (this.player.speedUp) {
                    this.player.speedUp = undefined
                }
            }
            //with item
            this.items.forEach((item, i) => {
                if (item.status == "stored") return
                //with bomb
                if (item instanceof OBJECTS.Bomb) {
                    if (this.collision(item.bombBody, wall) && (item.status == "thrown" || item.status == "onGround")) item.status = "explode"    
                //with shell
                } else if (item instanceof OBJECTS.Shell) {
                    if (this.collision(item.shell, wall)) {
                        if (this.bounceShell(item, wall)) removeItem.push(i)
                    }
                }
            })
        })
        
        //box collision
        this.track.boxes.forEach((box, i)=> {
            if (this.collision(this.player.chasis, box.box)) { 
                removeBox.push(i)
                const rand = Math.random()
                if (rand > 0.66) this.items.push(new OBJECTS.Bomb(this.scene))
                else if (rand > 0.33) this.items.push(new OBJECTS.Mushroom(this.scene))
                else this.getShells()
            }
        })


        //remove elements

        for (let i of removeBox) {
            this.scene.remove(this.track.boxes[i].box)
        } 
        this.track.boxes.splice(0, this.track.boxes.length, ...this.track.boxes.filter((_,e)=> !removeBox.includes(e)))

        for (let i of removeItem) {
            if (this.items[i] instanceof OBJECTS.Bomb) this.scene.remove(this.items[i].bomb)
            else if (this.items[i] instanceof OBJECTS.Shell) this.scene.remove(this.items[i].shell)
            else this.scene.remove(this.items[i].ms)
        } 
        this.items.splice(0, this.items.length, ...this.items.filter((_,e)=> !removeItem.includes(e)))

        for (let i of removeTree) {
            this.scene.remove(this.track.forest[i].tree)
            this.track.forest.splice(i, 1)
        } 
        this.track.forest.splice(0, this.track.forest.length, ...this.track.forest.filter((_,e)=> !removeTree.includes(e)))
    }

    bounceShell(item:OBJECTS.Shell, obstacle: t.Mesh) : boolean {
        item.bounces +=1
        if (item.bounces == 3) return true
        else {

            let steps = 0
            do {
                steps +=1
                item.shell.position.set(
                    item.shell.position.x - item.v[0], 
                    item.shell.position.y,
                    item.shell.position.z - item.v[2]
                )
                item.shell.updateMatrixWorld(true)
            } while (this.collision(item.shell, obstacle))
            
            let xBounce = false
            item.shell.position.x += item.v[0]
            item.shell.updateMatrixWorld(true)
            if (this.collision(item.shell, obstacle)) xBounce = true
            item.shell.position.x -= item.v[0]*2
            item.shell.updateMatrixWorld(true)
            if (this.collision(item.shell, obstacle)) xBounce = true
            
            if (xBounce) item.v[0] *= -1
            else item.v[2] *= -1
            item.shell.position.x += item.v[0]

            return false
        }
    }

    //ITEM FUNCTIONS

    getShells() {
        for (let e = 0; e<3; e++) {
            const shell = new OBJECTS.Shell(this.scene)
            this.items.push(shell)
            shell.angle = this.player.chasis.rotation.y + e*2*Math.PI/3
            shell.shell.position.set(
                this.player.chasis.position.x + 30*Math.sin(shell.angle), 
                shell.shell.position.y,
                this.player.chasis.position.z + 30*Math.cos(shell.angle)
            )
            shell.shell.rotation.y = shell.angle
        }
    }

    throwItem() {
        let i = 0
        while ( i < this.items.length  && ( this.items[i]).status !== "stored") {i++}
        if (i == this.items.length) return

        const item = this.items[i]
        
        if (item instanceof OBJECTS.Bomb) {
            item.v = [-(-this.player.v+1.5)*Math.sin(this.player.chasis.rotation.y), 1, -(-this.player.v+1.5)*Math.cos(this.player.chasis.rotation.y)]
            
            item.bomb.position.set(
                this.player.chasis.position.x - 10*Math.sin(this.player.chasis.rotation.y), 
                item.bomb.position.y,
                this.player.chasis.position.z - 10*Math.cos(this.player.chasis.rotation.y)
            )
        } else if (item instanceof OBJECTS.Shell) {
            item.v = [-(-this.player.v+3)*Math.sin(this.player.chasis.rotation.y), 0, -(-this.player.v+3)*Math.cos(this.player.chasis.rotation.y)]

            item.shell.position.set(
                this.player.chasis.position.x - 10*Math.sin(this.player.chasis.rotation.y), 
                item.shell.position.y,
                this.player.chasis.position.z - 10*Math.cos(this.player.chasis.rotation.y)
            )
        } else if (item instanceof OBJECTS.Mushroom) {
            this.player.speedUp = new Date()
        }
        item.status = "thrown"
    }

    generateBoxes() {
    }

    tick() {
        this.renderer.render(this.scene, this.camera)
        this.moveObjects()
        this.handleCollisions()
        this.generateBoxes()
    }
    
}

export { memeKart }