// ============================================================================
// MODULE: DroneControls.js
// ============================================================================
// Handles user input and movement logic for the drone.
// Supports directional movement, altitude control, rotation, and thrust modes.
// Enforces terrain collision and world boundary constraints.
// ============================================================================

import { getTerrainHeight } from './Terrain.js';
import { DroneVariables, TerrainVariables } from './Variables.js';

// ============================================================================
// CLASS: DroneControls
// ============================================================================
export class DroneControls {
    // ------------------------------------------------------------------------
    // CONSTRUCTOR
    // ------------------------------------------------------------------------
    // Initializes input bindings, speed settings, and control parameters.
    // ------------------------------------------------------------------------
    constructor(drone, terrain, options = {}) {
        this.drone = drone;
        this.terrain = terrain;
        this.keys = {};

        // Movement configuration
        this.moveSpeed   = options.moveSpeed   || DroneVariables.moveSpeed;
        this.rotateSpeed = options.rotateSpeed || DroneVariables.rotateSpeed;

        // Environment boundaries and height limits
        this.worldSize   = options.worldSize   || terrain.size || TerrainVariables.terrainSize;
        this.heightMax   = options.heightMax   || DroneVariables.heightMax;

        // Speed multipliers
        this.basicMultiplier  = DroneVariables.basicMultiplier;
        this.thrustMultiplier = DroneVariables.thrustMultiplier;

        // Keyboard event listeners
        document.addEventListener('keydown', e => this.keys[e.code] = true);
        document.addEventListener('keyup',   e => this.keys[e.code] = false);
    }

    // ------------------------------------------------------------------------
    // METHOD: applyInput
    // ------------------------------------------------------------------------
    // Applies movement, rotation, and altitude updates based on current input.
    // Ensures drone remains within allowed terrain and height limits.
    // ------------------------------------------------------------------------
    applyInput(dt) {
        // Determine movement speed (thrust or normal)
        const multiplier = (this.keys['ShiftLeft'] || this.keys['ShiftRight'])
            ? this.thrustMultiplier
            : this.basicMultiplier;

        const move = this.moveSpeed * dt * multiplier;
        const rot  = this.rotateSpeed * dt;

        // ------------------------------------------------------------
        // TRANSLATION CONTROLS
        // ------------------------------------------------------------
        if (this.keys['KeyW']) this.drone.group.translateZ(-move); // Forward
        if (this.keys['KeyS']) this.drone.group.translateZ(move);  // Backward

        if (this.keys['KeyQ']) this.drone.group.translateX(-move); // Left strafe
        if (this.keys['KeyE']) this.drone.group.translateX(move);  // Right strafe

        // ------------------------------------------------------------
        // ROTATION CONTROLS
        // ------------------------------------------------------------
        if (this.keys['KeyA']) this.drone.group.rotation.y += rot; // Yaw left
        if (this.keys['KeyD']) this.drone.group.rotation.y -= rot; // Yaw right

        // ------------------------------------------------------------
        // ALTITUDE CONTROLS
        // ------------------------------------------------------------
        if (this.keys['Space']) this.drone.group.position.y += move; // Ascend
        if (this.keys['ControlLeft'] || this.keys['ControlRight'])
            this.drone.group.position.y -= move;                     // Descend

        // ------------------------------------------------------------
        // WORLD BOUNDARIES
        // ------------------------------------------------------------
        const half = this.worldSize / (
            TerrainVariables.terrainBorderFactor + TerrainVariables.terrainBorderDelimiter
        );
        this.drone.group.position.x = Math.max(-half, Math.min(half, this.drone.group.position.x));
        this.drone.group.position.z = Math.max(-half, Math.min(half, this.drone.group.position.z));

        // ------------------------------------------------------------
        // TERRAIN COLLISION & ALTITUDE LIMITS
        // ------------------------------------------------------------
        const groundHeight = getTerrainHeight(
            this.drone.group.position.x,
            this.drone.group.position.z,
            this.terrain.noise
        );

        const minHeight = Math.max(
            DroneVariables.nullPoint,
            groundHeight + DroneVariables.minAboveGround
        );

        this.drone.group.position.y = Math.max(
            minHeight,
            Math.min(this.heightMax, this.drone.group.position.y)
        );
    }
}
