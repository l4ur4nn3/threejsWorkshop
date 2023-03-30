import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//DISCLAIMER : Saturn doesn't look like Saturn.

//define the scene
const scene = new THREE.Scene();

//define the texture
const textureLoader = new THREE.TextureLoader();

//define saturn
const saturnGeom = new THREE.SphereGeometry(1)
const saturnMat = new THREE.MeshBasicMaterial({color:'pink'})
saturnMat.map = textureLoader.load('/Lava_004_SD/Lava_004_NORM.jpg')

const saturn = new THREE.Mesh(saturnGeom, saturnMat)
//add saturn to the scene
scene.add(saturn)

//define a moon
const moonGeom = new THREE.SphereGeometry(0.2)
const moonMat = new THREE.MeshBasicMaterial({color: 'lightblue'})
const moon = new THREE.Mesh(moonGeom, moonMat)
moonMat.map = textureLoader.load('/lava-006/Lava_006_ambientOcclusion.jpg')
//position the moon 
moon.position.x = 2
//add the moon to the scene
scene.add(moon) 

//define a ring of particles
const ringGeom = new THREE.BufferGeometry()
const particleNbr = 1000
const ringPositions = new Float32Array(particleNbr*3)
const ringColors = new Float32Array(particleNbr*3)

//define the particles
for(let i = 0; i < particleNbr; i++){
    const i3 = i*3
    const radius = 2 + Math.random()
    const randAngle = Math.random()*(Math.PI * 2)
    ringPositions[i3] = Math.cos(randAngle) * radius
    ringPositions[i3+1] = (Math.random()-0.5)* 0.1
    ringPositions[i3+2] = Math.sin(randAngle) * radius
    ringColors[i3]=Math.random()
    ringColors[i3+1]=Math.random()
    ringColors[i3+2]=Math.random()
}
//randomize the position and the color of the particles
ringGeom.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3))
ringGeom.setAttribute('color', new THREE.BufferAttribute(ringColors, 3))
//make the particles look great
const ringMaterial = new THREE.PointsMaterial({
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    size:0.05
})
//assemble the ring & add it to the scene
const ring = new THREE.Points(ringGeom, ringMaterial)
scene.add(ring)
//define the visual
const sizes = {
    width : window.innerWidth,
    height:window.innerHeight
}
//define the fov
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(3, 3, 3);
const center = new THREE.Vector3(0)
camera.lookAt(center);
scene.add(camera);

//put the js into the file
const canvas = document.querySelector('.webgl2')
const renderer = new THREE.WebGL1Renderer({
    canvas : canvas
})
//allow to control the fov with the cursor
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;
//render everything
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    // console.log(elapsedTime);

    // mesh.rotation.y = elapsedTime
    // mesh.rotation.x = elapsedTime * Math.PI
    // mesh.rotation.y = Math.sin(elapsedTime * 2)
    // mesh.rotation.z = Math.cos(elapsedTime * 2)
    moon.position.x = Math.cos(elapsedTime) * 3
    moon.position.z = Math.sin(elapsedTime) * 3

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    
    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    //renderer.render(scene, camera)
})
tick()