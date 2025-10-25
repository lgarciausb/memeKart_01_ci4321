import * as t from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Car } from "./objects"

document.addEventListener('DOMContentLoaded', () => {
    initializeThreeJS();
});


function initializeThreeJS() {
  const renderer = new t.WebGLRenderer({
    canvas : document.querySelector("#cnv") as HTMLCanvasElement
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth,window.innerHeight)

  const scene = new t.Scene()
  const sky = new t.TextureLoader().load("../public/17576286_xl.png")
  scene.background = sky

  //objects
  const camera = new t.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
  camera.position.set(20, 40, 80)
  const box = new t.Mesh(
        new t.BoxGeometry(16, 9, 42),
        new t.MeshStandardMaterial({color:0xFF69B4})
    )
    scene.add(box)

  const  light = new t.DirectionalLight( 0xffffff, 10 );
  scene.add(light)

  const gridHelper = new t.GridHelper(300,300)
  scene.add(gridHelper)

  //event handlerz

  //const controls = new OrbitControls( camera, renderer.domElement)

  function handleKeyDown(event:KeyboardEvent) {
      switch (event.key) {
          case 'w':
          case 'W':
              camera.rotation.x +=Math.PI/360
              break;
          case 's':
          case 'S':
            camera.rotation.x -=Math.PI/360
              break;
          case 'a':
          case 'A':
            camera.rotation.y -=Math.PI/360
              break;
          case 'd':
          case 'D':
              camera.rotation.y +=Math.PI/360
              break;
      }
  }
  function handleKeyUp(event:KeyboardEvent) {
      switch (event.key) {
          case 'w':
          case 'W':
              break;
          case 's':
          case 'S':
              break;
          case 'a':
          case 'A':
              break;
          case 'd':
          case 'D':
              break;
      }
  }
  window.addEventListener('keydown', handleKeyDown, false);
  window.addEventListener('keyup', handleKeyUp, false);

  //game loop
  function animate() {
    requestAnimationFrame(animate)

    //controls.update()
    renderer.render(scene, camera)
    //t.MathUtils.randFloatSpread(100)
  }
  animate()
}

