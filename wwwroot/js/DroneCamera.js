// ============================================================================
// MODULE: DroneCamera.js
// ============================================================================
// Controls camera behavior for the DronePilot simulation.
// Supports two modes: "third-person" (orbit) and "first-person" (cockpit view).
// Mouse input controls camera rotation and aiming; key "C" toggles mode.
// ============================================================================

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";

// ============================================================================
// CLASS: DroneCamera
// ============================================================================
export class DroneCamera {
    // ------------------------------------------------------------------------
    // CONSTRUCTOR
    // ------------------------------------------------------------------------
    // Initializes camera parameters, input handlers, and mode toggling logic.
    // ------------------------------------------------------------------------
    constructor(camera, domElement, drone) {
        this.camera = camera;
        this.drone = drone;
        this.domElement = domElement;

        // Default mode: third-person view
        this.mode = "third";

        // Camera orbit and view angles
        this.distance = 30;
        this.yaw = 0;
        this.pitch = 0.3;

        // Input state flags
        this.isDragging = false;
        this.isAiming = false;

        // --------------------------------------------------------------------
        // MOUSE EVENT HANDLERS
        // --------------------------------------------------------------------
        domElement.addEventListener("mousedown", (e) => {
            if (e.button === 0) this.isDragging = true; // Left button
            if (e.button === 2) this.isAiming = true;  // Right button
        });

        domElement.addEventListener("mouseup", (e) => {
            if (e.button === 0) this.isDragging = false;
            if (e.button === 2) this.isAiming = false;
        });

        domElement.addEventListener("contextmenu", (e) => e.preventDefault());

        domElement.addEventListener("mousemove", (e) => {
            // ----------------------------------------------------------------
            // THIRD-PERSON ROTATION (Orbit around drone)
            // ----------------------------------------------------------------
            if (this.mode === "third" && this.isDragging) {
                this.yaw -= e.movementX * 0.005;
                this.pitch -= e.movementY * 0.005;
                this.pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.pitch));
            }

            // ----------------------------------------------------------------
            // FIRST-PERSON AIMING (Free look within limited range)
            // ----------------------------------------------------------------
            if (this.mode === "first" && this.isAiming) {
                const rect = domElement.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2;
                const dy = (e.clientY - centerY) / (rect.height / 2);

                // Absolute pitch relative to canvas center
                this.pitch = THREE.MathUtils.degToRad(-dy * 77.5);
                this.pitch = Math.max(
                    THREE.MathUtils.degToRad(-67.5),
                    Math.min(THREE.MathUtils.degToRad(10), this.pitch)
                );

                // Relative yaw based on mouse X movement
                this.yaw -= e.movementX * 0.0025;
                this.yaw = Math.max(
                    THREE.MathUtils.degToRad(-45),
                    Math.min(THREE.MathUtils.degToRad(45), this.yaw)
                );
            }
        });

        // --------------------------------------------------------------------
        // MODE TOGGLE
        // --------------------------------------------------------------------
        window.addEventListener("keydown", (e) => {
            if (e.key.toLowerCase() === "c") this.toggleMode();
        });
    }

    // ------------------------------------------------------------------------
    // METHOD: toggleMode
    // ------------------------------------------------------------------------
    // Switches between first-person and third-person camera modes.
    // Hides the drone model in first-person for cockpit immersion.
    // ------------------------------------------------------------------------
    toggleMode() {
        this.mode = this.mode === "first" ? "third" : "first";
        console.log("📷 Camera mode:", this.mode);

        if (this.mode === "first") {
            this.drone.group.visible = false;
            this.yaw = 0;
            this.pitch = 0;
            window.dispatchEvent(new CustomEvent("crosshair", { detail: true }));
        } else {
            this.drone.group.visible = true;
            window.dispatchEvent(new CustomEvent("crosshair", { detail: false }));
        }
    }

    // ------------------------------------------------------------------------
    // METHOD: update
    // ------------------------------------------------------------------------
    // Updates camera position and orientation based on mode and drone position.
    // ------------------------------------------------------------------------
    update() {
        if (!this.drone || !this.drone.group) return;
        const dronePos = this.drone.group.position;

        // --------------------------------------------------------------------
        // FIRST-PERSON MODE
        // --------------------------------------------------------------------
        if (this.mode === "first") {
            this.camera.position.copy(dronePos);

            const baseQuat = this.drone.group.quaternion.clone();
            const pitchQuat = new THREE.Quaternion();
            pitchQuat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.pitch);

            const yawQuat = new THREE.Quaternion();
            yawQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);

            const finalQuat = baseQuat.clone()
                .multiply(yawQuat)
                .multiply(pitchQuat);

            this.camera.quaternion.copy(finalQuat);
        }

            // --------------------------------------------------------------------
            // THIRD-PERSON MODE
        // --------------------------------------------------------------------
        else {
            const offset = new THREE.Vector3(
                Math.cos(this.pitch) * Math.sin(this.yaw) * this.distance,
                Math.sin(this.pitch) * this.distance + 10,
                Math.cos(this.pitch) * Math.cos(this.yaw) * this.distance
            );
            this.camera.position.copy(dronePos).add(offset);
            this.camera.lookAt(dronePos);
        }
    }
}
