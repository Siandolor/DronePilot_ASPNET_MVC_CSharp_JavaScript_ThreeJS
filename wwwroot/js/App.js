// ============================================================================
// MODULE: App.js
// ============================================================================
// Main entry point for the DronePilot 3D application.
// Initializes Three.js scene, camera, lighting, terrain, drone, and controls.
// ============================================================================

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

import { Drone } from './Drone.js';
import { Terrain } from './Terrain.js';
import { DroneControls } from './DroneControls.js';
import { DroneCamera } from './DroneCamera.js';
import { Crosshair } from './Crosshair.js';
import { FogEffect } from './FogEffect.js';
import {
    ColorVariables,
    DroneVariables,
    StartPositionVariables,
    CameraPositionVariables,
    LightVariables,
    DistanceVariables
} from './Variables.js';

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================
(() => {
    // ------------------------------------------------------------------------
    // RENDERER SETUP
    // ------------------------------------------------------------------------
    const canvas = document.getElementById('threeCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // ------------------------------------------------------------------------
    // SCENE SETUP
    // ------------------------------------------------------------------------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(ColorVariables.backgroundColor);

    // Fog for atmospheric depth and realism
    new FogEffect(scene, ColorVariables.backgroundColor, DistanceVariables.fogNear, DistanceVariables.fogFar);

    // ------------------------------------------------------------------------
    // CAMERA SETUP
    // ------------------------------------------------------------------------
    const camera = new THREE.PerspectiveCamera(
        CameraPositionVariables.viewport,
        window.innerWidth / window.innerHeight,
        DistanceVariables.viewNear,
        DistanceVariables.viewFar
    );
    camera.position.set(
        CameraPositionVariables.startPosX,
        CameraPositionVariables.startPosY,
        CameraPositionVariables.startPosZ
    );

    // ------------------------------------------------------------------------
    // LIGHTING SETUP
    // ------------------------------------------------------------------------
    const ambient = new THREE.AmbientLight(ColorVariables.ambientLight, LightVariables.ambientLightIntensity);
    const directional = new THREE.DirectionalLight(ColorVariables.directionalLight, LightVariables.directionalLightIntensity);
    directional.position.set(
        LightVariables.directionalLightPosX,
        LightVariables.directionalLightPosY,
        LightVariables.directionalLightPosZ
    );
    directional.castShadow = true;
    scene.add(ambient, directional);

    // ------------------------------------------------------------------------
    // OBJECTS: TERRAIN & DRONE
    // ------------------------------------------------------------------------
    const terrain = new Terrain(scene);
    const drone = new Drone(
        scene,
        StartPositionVariables.startPosX,
        StartPositionVariables.startPosY,
        StartPositionVariables.startPosZ
    );

    // ------------------------------------------------------------------------
    // CONTROLS & CAMERA LOGIC
    // ------------------------------------------------------------------------
    const droneControls = new DroneControls(drone, terrain, {
        moveSpeed: DroneVariables.moveSpeed,
        rotateSpeed: DroneVariables.rotateSpeed,
        heightMax: DroneVariables.heightMax
    });

    const droneCamera = new DroneCamera(camera, renderer.domElement, drone);
    const crosshair = new Crosshair();

    // ------------------------------------------------------------------------
    // EVENT HANDLERS
    // ------------------------------------------------------------------------
    // Fire keybind (F key)
    window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'f') drone.fire(camera, droneCamera.mode);
    });

    // Window resize handler for responsive canvas
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ------------------------------------------------------------------------
    // ANIMATION LOOP
    // ------------------------------------------------------------------------
    let last = performance.now();

    function animate() {
        requestAnimationFrame(animate);

        const now = performance.now();
        const dt = (now - last) / 1000;
        last = now;

        // Drone physics & control updates
        droneControls.applyInput(dt);
        drone.update(dt);

        // Camera and UI updates
        droneCamera.update();
        crosshair.setVisible(droneCamera.mode === "first");

        // Render frame
        renderer.render(scene, camera);
    }

    // ------------------------------------------------------------------------
    // START APPLICATION
    // ------------------------------------------------------------------------
    animate();
})();
