// ============================================================================
// MODULE: CameraControls.js
// ============================================================================
// Provides manual orbit and zoom controls for the camera using mouse or touch.
// Supports rotation (RMB / single touch) and zooming (LMB / pinch / scroll).
// ============================================================================

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

// ============================================================================
// CLASS: CameraControls
// ============================================================================
export class CameraControls {
    // ------------------------------------------------------------------------
    // CONSTRUCTOR
    // ------------------------------------------------------------------------
    // Initializes the camera control system and binds input event listeners.
    // ------------------------------------------------------------------------
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;

        // Interaction states
        this.isRotating = false;
        this.isZooming = false;
        this.lastX = 0;
        this.lastY = 0;

        // Camera position logic
        this.target = new THREE.Vector3(0, 0, 0);
        this.spherical = new THREE.Spherical();
        this.spherical.setFromVector3(this.camera.position.clone().sub(this.target));

        // Disable context menu to allow RMB rotation
        domElement.addEventListener('contextmenu', e => e.preventDefault());

        // Mouse events
        domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
        domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
        domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
        domElement.addEventListener('wheel', this.onWheel.bind(this));

        // Touch events
        domElement.addEventListener('touchstart', this.onTouchStart.bind(this));
        domElement.addEventListener('touchend', this.onTouchEnd.bind(this));
        domElement.addEventListener('touchmove', this.onTouchMove.bind(this));
    }

    // ------------------------------------------------------------------------
    // CAMERA UPDATE
    // ------------------------------------------------------------------------
    // Repositions the camera according to current spherical coordinates.
    // ------------------------------------------------------------------------
    updateCamera() {
        const offset = new THREE.Vector3().setFromSpherical(this.spherical).add(this.target);
        this.camera.position.copy(offset);
        this.camera.lookAt(this.target);
    }

    // ------------------------------------------------------------------------
    // MOUSE INPUT HANDLERS
    // ------------------------------------------------------------------------
    onMouseDown(e) {
        if (e.button === 2) this.isRotating = true; // Right mouse button
        if (e.button === 0) this.isZooming = true;  // Left mouse button
        this.lastX = e.clientX;
        this.lastY = e.clientY;
    }

    onMouseUp(e) {
        if (e.button === 2) this.isRotating = false;
        if (e.button === 0) this.isZooming = false;
    }

    onMouseMove(e) {
        const dx = e.clientX - this.lastX;
        const dy = e.clientY - this.lastY;
        this.lastX = e.clientX;
        this.lastY = e.clientY;

        if (this.isRotating) {
            this.spherical.theta -= dx * 0.005;
            this.spherical.phi -= dy * 0.005;
            this.spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.spherical.phi));
        }
        if (this.isZooming) {
            this.spherical.radius += dy * 0.1;
            this.spherical.radius = Math.max(2, this.spherical.radius);
        }
        this.updateCamera();
    }

    onWheel(e) {
        this.spherical.radius += e.deltaY * 0.05;
        this.spherical.radius = Math.max(2, this.spherical.radius);
        this.updateCamera();
    }

    // ------------------------------------------------------------------------
    // TOUCH INPUT HANDLERS
    // ------------------------------------------------------------------------
    onTouchStart(e) {
        if (e.touches.length === 1) this.isRotating = true;
        if (e.touches.length === 2) this.isZooming = true;
        this.lastX = e.touches[0].clientX;
        this.lastY = e.touches[0].clientY;
    }

    onTouchEnd() {
        this.isRotating = false;
        this.isZooming = false;
    }

    onTouchMove(e) {
        const dx = e.touches[0].clientX - this.lastX;
        const dy = e.touches[0].clientY - this.lastY;
        this.lastX = e.touches[0].clientX;
        this.lastY = e.touches[0].clientY;

        if (this.isRotating && e.touches.length === 1) {
            this.spherical.theta -= dx * 0.005;
            this.spherical.phi -= dy * 0.005;
            this.spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.spherical.phi));
        }
        if (this.isZooming && e.touches.length === 2) {
            this.spherical.radius += dy * 0.1;
            this.spherical.radius = Math.max(2, this.spherical.radius);
        }
        this.updateCamera();
    }
}
