import { memeKart } from "./memeKart";

document.addEventListener('DOMContentLoaded', () => {
    main();
});


function main() {

    const MK = new memeKart()

    //game loop
    function animate() {
        requestAnimationFrame(animate)
        MK.tick()
    }
    animate()
}

