// ============================================================================
// MODULE: FogEffect.js
// ============================================================================
// Adds atmospheric fog to the Three.js scene for depth perception and realism.
// The fog color and distance parameters are defined in Variables.js.
// ============================================================================

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { ColorVariables, DistanceVariables } from './Variables.js';

// ============================================================================
// CLASS: FogEffect
// ============================================================================
export class FogEffect {
    // ------------------------------------------------------------------------
    // CONSTRUCTOR
    // ------------------------------------------------------------------------
    // Initializes a linear fog effect and assigns it to the active scene.
    // Parameters:
    //  - scene : THREE.Scene — target scene object
    //  - color : fog color (default from ColorVariables.backgroundColor)
    //  - near  : fog start distance (default from DistanceVariables.fogNear)
    //  - far   : fog end distance   (default from DistanceVariables.fogFar)
    // ------------------------------------------------------------------------
    constructor(
        scene,
        color = ColorVariables.backgroundColor,
        near = DistanceVariables.fogNear,
        far  = DistanceVariables.fogFar
    ) {
        scene.fog = new THREE.Fog(color, near, far);
    }
}
