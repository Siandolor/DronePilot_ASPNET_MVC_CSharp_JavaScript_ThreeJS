// ============================================================================
// MODULE: Drone.js
// ============================================================================
// Defines the 3D drone model, including body, rotors, gimbal, skids, and turret.
// Handles rendering, rotation, and projectile logic (firing, cooldown, TTL).
// ============================================================================

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { ColorVariables, DroneVariables, StartPositionVariables } from './Variables.js';

// ============================================================================
// CLASS: Drone
// ============================================================================
export class Drone {
    // ------------------------------------------------------------------------
    // CONSTRUCTOR
    // ------------------------------------------------------------------------
    // Builds and initializes the drone with all subcomponents.
    // ------------------------------------------------------------------------
    constructor(
        scene,
        startX = StartPositionVariables.startPosX,
        startY = StartPositionVariables.startPosY,
        startZ = StartPositionVariables.startPosZ
    ) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.group.position.set(startX, startY, startZ);
        scene.add(this.group);

        // Build structural components
        this.buildBody();
        this.buildGimbal();
        this.buildRotors();
        this.buildSkids();
        this.buildTurret();

        // Initialize firing system
        this.projectiles = [];
        this.projectileSpeed = DroneVariables.projectileSpeed;
        this.projectileTTL = DroneVariables.projectileTTL;
        this.cooldown = DroneVariables.cooldown;
        this.cooldownTime = DroneVariables.cooldownTime;
    }

    // ------------------------------------------------------------------------
    // BUILD: BODY
    // ------------------------------------------------------------------------
    // Creates the main spherical chassis of the drone.
    // ------------------------------------------------------------------------
    buildBody() {
        const mat = new THREE.MeshStandardMaterial({
            color: ColorVariables.droneBodyColor,
            metalness: ColorVariables.droneMetalness,
            roughness: ColorVariables.droneRoughness
        });
        const geo = new THREE.SphereGeometry(
            DroneVariables.droneSphereSize,
            DroneVariables.droneElementsSide,
            DroneVariables.droneElementsHeight
        );
        const body = new THREE.Mesh(geo, mat);
        body.scale.set(1, 0.75, 1.5);
        this.body = body;
        this.group.add(body);
    }

    // ------------------------------------------------------------------------
    // BUILD: GIMBAL
    // ------------------------------------------------------------------------
    // Adds a stabilizing gimbal sphere below the main body.
    // ------------------------------------------------------------------------
    buildGimbal() {
        const mat = new THREE.MeshStandardMaterial({
            color: ColorVariables.droneRotorColor,
            metalness: ColorVariables.rotorMetalness,
            roughness: ColorVariables.rotorRoughness
        });
        const geo = new THREE.SphereGeometry(
            DroneVariables.gimbalSphereSize,
            DroneVariables.gimbalElementsSide,
            DroneVariables.gimbalElementsHeight
        );
        const gimbal = new THREE.Mesh(geo, mat);
        gimbal.position.set(0, -0.5, -0.5);
        gimbal.scale.z = 0.75;
        this.body.add(gimbal);
        this.gimbal = gimbal;
    }

    // ------------------------------------------------------------------------
    // BUILD: ROTORS
    // ------------------------------------------------------------------------
    // Generates four rotor arms at 90° intervals, each with its rotor disc.
    // ------------------------------------------------------------------------
    buildRotors() {
        this.rotors = [];
        const armLength = DroneVariables.armCylinderSizeZ;

        for (let i = 0; i < 4; i++) {
            const angle = i * Math.PI / 2 + Math.PI / 4;

            // Arm geometry
            const armGeo = new THREE.CylinderGeometry(
                DroneVariables.armCylinderSizeX,
                DroneVariables.armCylinderSizeY,
                armLength,
                DroneVariables.armCylinderElements
            );
            const armMat = new THREE.MeshStandardMaterial({
                color: ColorVariables.droneArmColor,
                metalness: DroneVariables.droneMetalness,
                roughness: DroneVariables.droneRoughness
            });
            const arm = new THREE.Mesh(armGeo, armMat);
            arm.rotation.z = Math.PI / 2;
            arm.position.set(Math.cos(angle) * armLength / 2, 0, Math.sin(angle) * armLength / 2);
            arm.rotation.y = -angle;
            this.group.add(arm);

            // Rotor geometry
            const rotorGeo = new THREE.CylinderGeometry(
                DroneVariables.rotorCylinderSizeX,
                DroneVariables.rotorCylinderSizeY,
                DroneVariables.rotorCylinderSizeZ,
                DroneVariables.rotorCylinderElements
            );
            const rotorMat = new THREE.MeshStandardMaterial({
                color: ColorVariables.droneRotorColor,
                metalness: ColorVariables.rotorMetalness,
                roughness: ColorVariables.rotorRoughness
            });
            const rotor = new THREE.Mesh(rotorGeo, rotorMat);
            rotor.rotation.x = Math.PI;
            rotor.position.set(Math.cos(angle) * armLength, 0.1, Math.sin(angle) * armLength);
            this.group.add(rotor);
            this.rotors.push(rotor);
        }
    }

    // ------------------------------------------------------------------------
    // BUILD: SKIDS
    // ------------------------------------------------------------------------
    // Creates the drone’s landing gear using tubular and cylindrical geometry.
    // ------------------------------------------------------------------------
    buildSkids() {
        this.skids = new THREE.Group();

        const bodyRadius = DroneVariables.droneSphereSize;
        const halfWidth = bodyRadius * this.body.scale.x;
        const halfHeight = bodyRadius * this.body.scale.y;
        const halfLength = bodyRadius * this.body.scale.z;

        const skidHeight = halfHeight * 1.1;
        const skidLength = halfLength * 2.0;
        const skidThickness = 0.04;

        const skidMat = new THREE.MeshStandardMaterial({
            color: ColorVariables.skidColor,
            metalness: ColorVariables.rotorMetalness,
            roughness: ColorVariables.droneRoughness
        });

        // Helper: creates a curved skid shape
        const makeCurve = (xOffset) => {
            return new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(xOffset, -skidHeight, -skidLength * 0.5),
                new THREE.Vector3(xOffset, -skidHeight - 0.1, 0),
                new THREE.Vector3(xOffset, -skidHeight, skidLength * 0.5)
            );
        };

        const tubeSettings = { tubularSegments: 20, radius: skidThickness, radialSegments: 8, closed: false };

        const leftCurve = makeCurve(-halfWidth * 0.8);
        const rightCurve = makeCurve(halfWidth * 0.8);

        const leftSkid = new THREE.Mesh(new THREE.TubeGeometry(leftCurve, ...Object.values(tubeSettings)), skidMat);
        const rightSkid = new THREE.Mesh(new THREE.TubeGeometry(rightCurve, ...Object.values(tubeSettings)), skidMat);

        this.skids.add(leftSkid, rightSkid);

        // Add crossbars for structural stability
        const crossbarGeo = new THREE.CylinderGeometry(skidThickness * 0.6, skidThickness * 0.6, halfWidth * 1.6, 6);
        const makeCrossbar = (zOffset) => {
            const cross = new THREE.Mesh(crossbarGeo, skidMat);
            cross.rotation.z = Math.PI / 2;
            cross.position.set(0, -skidHeight, zOffset);
            return cross;
        };

        this.skids.add(makeCrossbar(-skidLength * 0.3));
        this.skids.add(makeCrossbar(0));
        this.skids.add(makeCrossbar(skidLength * 0.3));

        this.group.add(this.skids);
    }

    // ------------------------------------------------------------------------
    // BUILD: TURRET
    // ------------------------------------------------------------------------
    // Adds a forward-facing cannon that can fire projectiles.
    // ------------------------------------------------------------------------
    buildTurret() {
        this.turret = new THREE.Group();

        // Base
        const baseGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.16, 64);
        const baseMat = new THREE.MeshStandardMaterial({
            color: ColorVariables.skidColor,
            metalness: ColorVariables.droneMetalness,
            roughness: ColorVariables.rotorRoughness
        });
        const turretBase = new THREE.Mesh(baseGeo, baseMat);
        turretBase.rotation.x = Math.PI / 2;
        this.turret.add(turretBase);

        // Barrel pivot & geometry
        this.barrelPivot = new THREE.Group();
        this.barrelPivot.position.set(0, -0.18, -0.6);
        this.turret.add(this.barrelPivot);

        const barrelGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.0, 8);
        const barrelMat = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.3,
            roughness: 0.4
        });
        const barrel = new THREE.Mesh(barrelGeo, barrelMat);
        barrel.rotation.x = Math.PI / 2;
        barrel.position.set(0, 0, -0.5);
        this.barrelPivot.add(barrel);
        this.barrel = barrel;

        this.turret.position.set(0, -0.2, 0.6);
        this.group.add(this.turret);
    }

    // ------------------------------------------------------------------------
    // FIRE
    // ------------------------------------------------------------------------
    // Fires a projectile from the camera’s viewpoint (first-person mode only).
    // ------------------------------------------------------------------------
    fire(camera, mode) {
        if (this.cooldown > 0) return;
        if (mode !== "first") return;

        this.cooldown = this.cooldownTime;

        // Direction from camera forward vector
        const dir = new THREE.Vector3(0, 0, -1)
            .applyQuaternion(camera.quaternion)
            .normalize();

        // Muzzle position in world space
        const muzzleWorld = new THREE.Vector3();
        camera.getWorldPosition(muzzleWorld);

        // Projectile mesh
        const projGeo = new THREE.SphereGeometry(0.06, 8, 6);
        const projMat = new THREE.MeshStandardMaterial({
            color: ColorVariables.fireColor,
            emissive: 0xffaa33,
            metalness: 0.1,
            roughness: 0.3
        });
        const proj = new THREE.Mesh(projGeo, projMat);
        proj.position.copy(muzzleWorld);
        proj.userData = { dir: dir.clone(), life: this.projectileTTL };

        this.scene.add(proj);
        this.projectiles.push(proj);
    }

    // ------------------------------------------------------------------------
    // UPDATE LOOP
    // ------------------------------------------------------------------------
    // Handles rotor rotation, cooldown timing, and projectile updates.
    // ------------------------------------------------------------------------
    update(dt) {
        // Rotor spin
        for (let r of this.rotors) {
            r.rotation.y += dt * 40;
        }

        // Cooldown timer
        if (this.cooldown > 0) {
            this.cooldown = Math.max(0, this.cooldown - dt);
        }

        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.position.addScaledVector(p.userData.dir, this.projectileSpeed * dt);
            p.userData.life -= dt;
            if (p.userData.life <= 0) {
                this.scene.remove(p);
                this.projectiles.splice(i, 1);
            }
        }
    }
}
