import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from "dat.gui";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Basics
 */
// Debug
const gui = new dat.GUI({ closed: false, width: 250 });

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matCapTexture = textureLoader.load("/textures/matcaps/1.png");

/**
 * Fonts and Objects
 */
const objects = [];

const fontLoader = new FontLoader();
fontLoader.load(
    "/fonts/mori_semibold.json",
    (font) => {
        const textGeometry = new TextGeometry(
            "Hello, World!",
            {
                font: font,
                size: 3,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.06,
                bevelSize: 0.04,
                bevelOffset: 0,
                bevelSegments: 5
            }
        );
        textGeometry.center();

        const material = new THREE.MeshMatcapMaterial({
            matcap: matCapTexture,
        })

        const text = new THREE.Mesh(textGeometry, material);
        scene.add(text);

        const donutGeometry = new THREE.TorusGeometry(0.6, 0.4, 20, 45);
        const boxGeometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
        const coneGeometry = new THREE.ConeGeometry(0.9, 0.9, 3);

        for (let i = 0; i < 1200; i++) {
            
            let geometry;
            const shape = Math.floor(Math.random() * 5);
            switch (shape) {
                case 0:
                    geometry = donutGeometry;
                    break;
                case 1:
                    geometry = boxGeometry;
                    break;
                case 2:
                    geometry = coneGeometry;
                    break;
                case 3:
                    geometry = donutGeometry;
                    break;
                case 4:
                    geometry = donutGeometry;
                    break;                                        
            }

            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.x = (Math.random() - 0.5) * 80;
            mesh.position.y = (Math.random() - 0.5) * 80;
            mesh.position.z = (Math.random() - 0.5) * 80;

            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;

            const scale = Math.random();

            mesh.scale.set(scale, scale, scale);

            objects.push(mesh);
            scene.add(mesh);
        }
    }
);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 18;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.5;
controls.maxDistance = 50;
controls.minDistance = 5;
controls.maxAzimuthAngle = Math.PI / 3;
controls.minAzimuthAngle = - Math.PI / 3;
controls.maxPolarAngle = Math.PI / 1.5;
controls.minPolarAngle = Math.PI / 4;

const enableFullRotation = {
    enableFullRotation: () => {
        controls.maxAzimuthAngle = Infinity;
        controls.minAzimuthAngle = Infinity;
    }
}

gui
    .add(enableFullRotation, "enableFullRotation");
gui
    .add(controls, "autoRotate");
gui
    .add(controls, "autoRotateSpeed", -10, 10, 0.001);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha:  true,
})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock()

const animate = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Animate objects
    for (const object of objects) {
        object.rotation.y = elapsedTime * 0.25;
    }

    // Render
    renderer.render(scene, camera);

    // Call animate again on the next frame
    window.requestAnimationFrame(animate);
}

animate();