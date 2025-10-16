# DronePilot – 3D Drone Controller (ASP.NET MVC + Three.js)

---

## Overview
**DronePilot** is an interactive 3D web application built with **ASP.NET Core MVC** and **Three.js**.  
It simulates a procedurally generated terrain and a fully functional drone model with physical controls,  
camera modes, and a minimal, performance-optimized rendering pipeline.

The project follows a clean modular structure and consistent documentation style across all files.

---

## Architecture

```
DronePilot/
├── Controllers/
│   └── HomeController.cs          # Main route controller
│
├── Views/
│   └── Home/
│       └── Index.cshtml           # Main view: canvas container & renderer
│   └── Shared/
│       └── _Layout.cshtml         # Base layout with Bootstrap & Three.js imports
│           └── _Layout.cshtml.css # Layout-specific UI rules
├── wwwroot/
│   ├── css/
│   │   └── site.css               # Global styles
│   ├── js/
│   │   ├── App.js                 # Main application bootstrap
│   │   ├── Drone.js               # Drone model (procedural)
│   │   ├── DroneCamera.js         # Camera system (1st/3rd person)
│   │   ├── DroneControls.js       # Movement and input handling
│   │   ├── Crosshair.js           # HUD overlay & targeting UI
│   │   ├── Terrain.js             # Procedural terrain generator
│   │   ├── FogEffect.js           # Scene fog and depth configuration
│   │   └── Variables.js           # Shared constants and configuration
│   └── lib/
│       └── bootstrap/             # UI framework
│
├── Program.cs                     # Application entry point
├── DronePilot.csproj              # ASP.NET project configuration
└── README.md                      # (this file)
```

---

## Functional Overview

| Component | Description |
|------------|-------------|
| **Drone** | Procedurally constructed 3D model with rotors, gimbal, skids, and turret. Includes projectile firing and cooldown logic. |
| **DroneControls** | Keyboard input handler. Supports thrust, strafe, yaw, and vertical movement. Enforces altitude and world boundaries. |
| **DroneCamera** | Dual camera modes (first-person / third-person). Mouse-controlled yaw/pitch, toggle with **C** key. |
| **Crosshair** | HTML-based overlay aligned with the viewport center. Displays crosshair and HUD corner markers. |
| **Terrain** | Procedurally generated terrain using `ImprovedNoise`. Color, metalness, and roughness vary by height. Includes water plane overlay. |
| **FogEffect** | Adds atmospheric fog for depth realism. Controlled via `ColorVariables` and `DistanceVariables`. |
| **Variables** | Central configuration file for all color palettes, lighting, terrain constants, and drone parameters. |

---

## Controls

| Action | Key |
|:-------|:---:|
| Move forward / backward | **W / S** |
| Strafe left / right | **Q / E** |
| Rotate (yaw) | **A / D** |
| Ascend / Descend | **Space / Ctrl** |
| Boost (thrust) | **Shift** |
| Toggle camera mode | **C** |
| Fire (first-person only) | **F** |

---

## Visual & Environment Parameters

| Setting | Description |
|----------|--------------|
| **Fog** | Linear fog (`THREE.Fog`) with adjustable near/far clipping. |
| **Lighting** | Combination of ambient and directional light for realistic shading. |
| **Terrain** | 8192×8192 plane subdivided into 256×256 segments, generated with layered noise. |
| **Drone Altitude** | Clamped between terrain height + 4 and 2048 units max. |
| **Camera Distance** | 30 units behind drone in third-person mode. |

---

## Technical Stack

- **Framework:** ASP.NET Core MVC 8
- **Frontend Rendering:** Three.js (r152)
- **Language:** ES6 Modules + C# (.NET 8)
- **UI Framework:** Bootstrap 5
- **Noise Generation:** `ImprovedNoise` (from Three.js examples)
- **Development Environment:** Visual Studio / VS Code

---

## Setup & Run

### Prerequisites
- .NET SDK 8.0 or later
- Node.js (optional, for bundling)

### Run Application
```bash
  dotnet restore
  dotnet build
  dotnet run
```

Then open your browser at:
```
https://localhost:5001
```

---

## Future Extensions

| Feature | Status | Description |
|----------|:------:|-------------|
| Collision physics | ☐ Planned | Integrate PhysX or Cannon.js for rigid-body simulation |
| Volumetric fog | ☐ Planned | Exponential fog with weather conditions |
| Drone AI | ☐ Planned | Basic waypoint-following or autonomous mode |
| Terrain dynamics | ☐ Planned | Erosion simulation, vegetation, texture blending |
| HUD telemetry | ☐ Planned | Display altitude, speed, and system data in overlay |

---

## Author
**Daniel Fitz, MBA, MSc, BSc**  
Vienna, Austria  
Developer & Security Technologist — *Post-Quantum Cryptography, Blockchain/Digital Ledger & Simulation*  
C/C++ · C# · Java · Python · Visual Basic · ABAP · JavaScript/TypeScript

International Accounting · Macroeconomics & International Relations · Physiotherapy · Computer Sciences  
Former Officer of the German Federal Armed Forces

---

## License
**MIT License** — free for educational and research use.  
Attribution required for redistribution or commercial adaptation.

---

> “We don’t control the drone.  
> We control the perspective it offers.”  
> — Daniel Fitz, 2025
