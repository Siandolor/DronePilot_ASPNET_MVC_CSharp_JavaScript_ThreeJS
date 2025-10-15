// ============================================================================
// MODULE: Variables.js
// ============================================================================
// Defines shared configuration constants for DronePilot modules.
// Includes colors, terrain parameters, drone settings, lighting, and distances.
// ============================================================================


// ============================================================================
// COLOR VARIABLES
// ============================================================================
// Defines all color values and material properties used across the scene.
// ============================================================================
export const ColorVariables = {
    // Environment
    backgroundColor: 0x87ceeb,

    // Lighting
    ambientLight: 0xffffff,
    directionalLight: 0xffffff,

    // UI
    crosshairColor: "#ffffff",
    cameraColor1: "#ff0000",
    cameraColor2: "#00ff00",

    // Drone components
    droneBodyColor: 0x404852,
    droneArmColor: 0x2b2b2b,
    droneRotorColor: 0x111111,
    skidColor: 0x55ee22,
    fireColor: 0xffdd66,

    // Terrain color gradient (by elevation)
    terrainColor_m50: 0x000033,
    terrainColor_m40: 0x001a66,
    terrainColor_m30: 0x003399,
    terrainColor_m20: 0x004ccf,
    terrainColor_m10: 0x1f75ff,
    terrainColor_0:   0x66ccff,
    terrainColor_p10: 0xeedc82,
    terrainColor_p20: 0xd2b48c,
    terrainColor_p30: 0x7cfc00,
    terrainColor_p40: 0x228b22,
    terrainColor_p50: 0x006400,
    terrainColor_p60: 0x8b7765,
    terrainColor_p70: 0xa9a9a9,
    terrainColor_p80: 0x808080,
    terrainColor_p90: 0x696969,
    terrainColor_p100: 0xffffff,

    // Material parameters
    droneMetalness: 0.25,
    droneRoughness: 0.75,
    rotorMetalness: 0.125,
    rotorRoughness: 0.025,
    landMetalness: 0.125,
    landRoughness: 0.875,
    waterMetalness: 0.875,
    waterRoughness: 0.125,

    // Water properties
    waterColor: 0x1f75ff,
    waterOpacity: 0.875
};


// ============================================================================
// DRONE VARIABLES
// ============================================================================
// Core movement and structural settings for the drone model.
// ============================================================================
export const DroneVariables = {
    // Flight parameters
    moveSpeed: 32.0,
    rotateSpeed: 2,
    heightMax: 2048,

    // Speed multipliers
    basicMultiplier: 2,
    thrustMultiplier: 6,

    // Terrain interaction
    minAboveGround: 4,
    nullPoint: 0,

    // Geometry: body
    droneSphereSize: 0.75,
    droneElementsSide: 128,
    droneElementsHeight: 128,

    // Geometry: gimbal
    gimbalSphereSize: 0.25,
    gimbalElementsSide: 64,
    gimbalElementsHeight: 64,

    // Geometry: arms
    armCylinderSizeX: 0.075,
    armCylinderSizeY: 0.075,
    armCylinderSizeZ: 2,
    armCylinderElements: 64,

    // Geometry: rotors
    rotorCylinderSizeX: 0.875,
    rotorCylinderSizeY: 0.875,
    rotorCylinderSizeZ: 0.005,
    rotorCylinderElements: 64,

    // Weapons / projectiles
    projectileSpeed: 120,
    projectileTTL: 4,
    cooldown: 0,
    cooldownTime: 0.3
};


// ============================================================================
// TERRAIN VARIABLES
// ============================================================================
// Controls the procedural terrain generation and rendering parameters.
// ============================================================================
export const TerrainVariables = {
    terrainSize: 8192,
    terrainDetails: 256,
    terrainBorderFactor: 2.000,
    terrainBorderDelimiter: 0.125,

    // Elevation thresholds
    terrainHeight_m50: -50,
    terrainHeight_m40: -40,
    terrainHeight_m30: -30,
    terrainHeight_m20: -20,
    terrainHeight_m10: -10,
    terrainHeight_0:   0,
    terrainHeight_p10: 10,
    terrainHeight_p20: 20,
    terrainHeight_p30: 30,
    terrainHeight_p40: 40,
    terrainHeight_p50: 50,
    terrainHeight_p60: 60,
    terrainHeight_p70: 70,
    terrainHeight_p80: 80,
    terrainHeight_p90: 90
};


// ============================================================================
// START POSITION VARIABLES
// ============================================================================
// Defines the initial spawn position of the drone in the scene.
// ============================================================================
export const StartPositionVariables = {
    startPosX: 0,
    startPosY: 50,
    startPosZ: 0
};


// ============================================================================
// CAMERA POSITION VARIABLES
// ============================================================================
// Defines camera projection and starting coordinates for scene initialization.
// ============================================================================
export const CameraPositionVariables = {
    viewport: 50,
    startPosX: 0,
    startPosY: 10000,
    startPosZ: 0
};


// ============================================================================
// LIGHT VARIABLES
// ============================================================================
// Lighting configuration for ambient and directional illumination.
// ============================================================================
export const LightVariables = {
    directionalLightIntensity: 0.875,
    ambientLightIntensity: 0.25,
    directionalLightPosX: 10,
    directionalLightPosY: 1000,
    directionalLightPosZ: 10
};


// ============================================================================
// DISTANCE VARIABLES
// ============================================================================
// Controls render distances and fog boundaries for visual optimization.
// ============================================================================
export const DistanceVariables = {
    viewNear: 8,
    viewFar: 4096,
    fogNear: 128,
    fogFar: 1024
};
