// ============================================================================
// MODULE: Terrain.js
// ============================================================================
// Generates the procedural terrain and water surface for the DronePilot scene.
// Uses multi-layered ImprovedNoise for height variation and color mapping.
// ============================================================================

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { ImprovedNoise } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/math/ImprovedNoise.js';
import { ColorVariables, TerrainVariables } from './Variables.js';

// ============================================================================
// FUNCTION: getTerrainHeight
// ============================================================================
// Computes the terrain height at coordinates (x, z) using fractal noise.
// Includes domain warping for realistic, non-repetitive elevation patterns.
// Returns the resulting height value (float).
// ============================================================================
export function getTerrainHeight(x, z, noise) {
    const warpX = x + noise.noise(x * 0.001, z * 0.001, 50) * 128;
    const warpZ = z + noise.noise(x * 0.001, z * 0.001, 100) * 128;

    let h = 0;
    h += noise.noise(warpX * 0.002, warpZ * 0.002, 0) * 100;
    h += noise.noise(warpX * 0.01,  warpZ * 0.01,  0) * 25;
    h += noise.noise(warpX * 0.05,  warpZ * 0.05,  0) * 5;
    return h;
}

// ============================================================================
// CLASS: Terrain
// ============================================================================
// Creates and configures a procedural terrain mesh with color-coded elevation,
// dynamic shading attributes (metalness, roughness), and water surface overlay.
// ============================================================================
export class Terrain {
    // ------------------------------------------------------------------------
    // CONSTRUCTOR
    // ------------------------------------------------------------------------
    // Generates the geometry, material, and color attributes for the terrain.
    // ------------------------------------------------------------------------
    constructor(scene) {
        // Terrain size and resolution
        this.size = TerrainVariables.terrainSize;
        this.seg  = TerrainVariables.terrainDetails;
        this.noise = new ImprovedNoise();

        // --------------------------------------------------------------------
        // GEOMETRY SETUP
        // --------------------------------------------------------------------
        const geometry = new THREE.PlaneGeometry(this.size, this.size, this.seg, this.seg);
        geometry.rotateX(-Math.PI / TerrainVariables.terrainBorderFactor);

        const pos = geometry.attributes.position;
        const colors = [];
        const metalnessAttr = [];
        const roughnessAttr = [];

        // --------------------------------------------------------------------
        // HEIGHTMAP & COLOR CALCULATION
        // --------------------------------------------------------------------
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);
            const h = getTerrainHeight(x, z, this.noise);

            // Height normalization
            let fixedHeight = h;
            if (h > -1 && h < 0) fixedHeight = -1;
            if (h >= 0 && h < 1) fixedHeight = 1;
            pos.setY(i, fixedHeight);

            // Height-based color selection
            let hex;
            if (h <= TerrainVariables.terrainHeight_m50) hex = ColorVariables.terrainColor_m50;
            else if (h <= TerrainVariables.terrainHeight_m40) hex = ColorVariables.terrainColor_m40;
            else if (h <= TerrainVariables.terrainHeight_m30) hex = ColorVariables.terrainColor_m30;
            else if (h <= TerrainVariables.terrainHeight_m20) hex = ColorVariables.terrainColor_m20;
            else if (h <= TerrainVariables.terrainHeight_m10) hex = ColorVariables.terrainColor_m10;
            else if (h <= TerrainVariables.terrainHeight_0)   hex = ColorVariables.terrainColor_0;
            else if (h <= TerrainVariables.terrainHeight_p10) hex = ColorVariables.terrainColor_p10;
            else if (h <= TerrainVariables.terrainHeight_p20) hex = ColorVariables.terrainColor_p20;
            else if (h <= TerrainVariables.terrainHeight_p30) hex = ColorVariables.terrainColor_p30;
            else if (h <= TerrainVariables.terrainHeight_p40) hex = ColorVariables.terrainColor_p40;
            else if (h <= TerrainVariables.terrainHeight_p50) hex = ColorVariables.terrainColor_p50;
            else if (h <= TerrainVariables.terrainHeight_p60) hex = ColorVariables.terrainColor_p60;
            else if (h <= TerrainVariables.terrainHeight_p70) hex = ColorVariables.terrainColor_p70;
            else if (h <= TerrainVariables.terrainHeight_p80) hex = ColorVariables.terrainColor_p80;
            else if (h <= TerrainVariables.terrainHeight_p90) hex = ColorVariables.terrainColor_p90;
            else hex = ColorVariables.terrainColor_p100;

            const c = new THREE.Color(hex);
            colors.push(c.r, c.g, c.b);

            // Surface material properties by elevation
            if (h <= 0) {
                metalnessAttr.push(ColorVariables.waterMetalness);
                roughnessAttr.push(ColorVariables.waterRoughness);
            } else {
                metalnessAttr.push(ColorVariables.landMetalness);
                roughnessAttr.push(ColorVariables.landRoughness);
            }
        }

        // --------------------------------------------------------------------
        // ATTRIBUTE ASSIGNMENT
        // --------------------------------------------------------------------
        geometry.setAttribute("color",     new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute("metalness", new THREE.Float32BufferAttribute(metalnessAttr, 1));
        geometry.setAttribute("roughness", new THREE.Float32BufferAttribute(roughnessAttr, 1));
        geometry.computeVertexNormals();

        // --------------------------------------------------------------------
        // MATERIAL SETUP (Custom shader modification)
        // --------------------------------------------------------------------
        const material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            flatShading: false,
            side: THREE.DoubleSide
        });

        // Extend shader to support per-vertex metalness and roughness
        material.onBeforeCompile = (shader) => {
            shader.vertexShader = shader.vertexShader.replace(
                '#include <common>',
                '#include <common>\nattribute float metalness;\nattribute float roughness;\nvarying float vMetalness;\nvarying float vRoughness;'
            );
            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                '#include <begin_vertex>\nvMetalness = metalness;\nvRoughness = roughness;'
            );
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                '#include <common>\nvarying float vMetalness;\nvarying float vRoughness;'
            );
            shader.fragmentShader = shader.fragmentShader.replace(
                'float metalnessFactor = metalness;',
                'float metalnessFactor = vMetalness;'
            );
            shader.fragmentShader = shader.fragmentShader.replace(
                'float roughnessFactor = roughness;',
                'float roughnessFactor = vRoughness;'
            );
        };

        // --------------------------------------------------------------------
        // MESH CREATION
        // --------------------------------------------------------------------
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.receiveShadow = true;
        scene.add(this.mesh);

        // --------------------------------------------------------------------
        // WATER PLANE
        // --------------------------------------------------------------------
        const waterGeo = new THREE.PlaneGeometry(this.size, this.size, 1, 1);
        waterGeo.rotateX(-Math.PI / 2);

        const waterMat = new THREE.MeshStandardMaterial({
            color: ColorVariables.waterColor,
            transparent: true,
            opacity: ColorVariables.waterOpacity,
            metalness: ColorVariables.waterMetalness,
            roughness: ColorVariables.waterRoughness,
            side: THREE.DoubleSide,
            polygonOffset: true,
            polygonOffsetFactor: -1,
            polygonOffsetUnits: -1
        });

        this.water = new THREE.Mesh(waterGeo, waterMat);
        this.water.position.y = 0.02;
        this.water.renderOrder = 1;
        this.mesh.renderOrder = 0;
        scene.add(this.water);
    }
}
