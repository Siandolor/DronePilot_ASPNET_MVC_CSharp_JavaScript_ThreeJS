// ============================================================================
// MODULE: Crosshair.js
// ============================================================================
// Defines a dynamic UI overlay that renders a crosshair and corner elements
// over the Three.js canvas. Used in first-person and targeting modes.
// ============================================================================

import { ColorVariables } from './Variables.js';

// ============================================================================
// CLASS: Crosshair
// ============================================================================
export class Crosshair {
    // ------------------------------------------------------------------------
    // CONSTRUCTOR
    // ------------------------------------------------------------------------
    // Creates the crosshair overlay inside the main canvas container.
    // ------------------------------------------------------------------------
    constructor() {
        const container = document.querySelector(".canvas-container");
        if (!container) {
            console.error("Crosshair: .canvas-container not found!");
            return;
        }

        this.container = container;

        // --------------------------------------------------------------------
        // MAIN OVERLAY ELEMENT
        // --------------------------------------------------------------------
        this.element = document.createElement("div");
        this.element.style.position = "absolute";
        this.element.style.top = "0";
        this.element.style.left = "0";
        this.element.style.width = "100%";
        this.element.style.height = "100%";
        this.element.style.pointerEvents = "none";
        this.element.style.zIndex = "1000";

        // --------------------------------------------------------------------
        // CENTRAL CROSSHAIR
        // --------------------------------------------------------------------
        const cross = document.createElement("div");
        cross.style.position = "absolute";
        cross.style.top = "50%";
        cross.style.left = "50%";
        cross.style.width = "27.5px";
        cross.style.height = "27.5px";
        cross.style.transform = "translate(-50%, -50%)";

        // Create horizontal and vertical lines
        cross.innerHTML = `
            <div style="position:absolute;top:50%;left:0;width:100%;height:2px;
                        background:${ColorVariables.crosshairColor};
                        transform:translateY(-50%);"></div>
            <div style="position:absolute;left:50%;top:0;width:2px;height:100%;
                        background:${ColorVariables.crosshairColor};
                        transform:translateX(-50%);"></div>
        `;
        this.element.appendChild(cross);

        // --------------------------------------------------------------------
        // CORNER ELEMENTS
        // --------------------------------------------------------------------
        // Generates decorative camera-like corner brackets at each viewport edge.
        // --------------------------------------------------------------------
        const makeCorner = (x, y) => {
            const strength = 2;
            const lengthInner = 8;
            const lengthOuter = 16;

            const corner = document.createElement("div");
            corner.style.position = "absolute";
            corner.style[x] = "2.5%";
            corner.style[y] = "5%";
            corner.style.width = "10%";
            corner.style.height = "10%";

            corner.innerHTML = `
                <!-- Outer lines -->
                <div style="position:absolute;${y}:0;${x}:0;width:${lengthOuter}%;height:${strength}%;
                            background:${ColorVariables.cameraColor1};"></div>
                <div style="position:absolute;${y}:0;${x}:0;width:${strength}%;height:${lengthOuter}%;
                            background:${ColorVariables.cameraColor1};"></div>

                <!-- Inner accent lines -->
                <div style="position:absolute;${y}:0;${x}:0;width:${lengthInner}%;height:${strength}%;
                            background:${ColorVariables.cameraColor2};
                            ${y === "top" ? "margin-top:25%;" : "margin-bottom:25%;"}"></div>
                <div style="position:absolute;${y}:0;${x}:0;width:${strength}%;height:${lengthInner}%;
                            background:${ColorVariables.cameraColor2};
                            ${x === "left" ? "margin-left:25%;" : "margin-right:25%;"}"></div>
            `;
            return corner;
        };

        this.element.appendChild(makeCorner("left", "top"));
        this.element.appendChild(makeCorner("right", "top"));
        this.element.appendChild(makeCorner("left", "bottom"));
        this.element.appendChild(makeCorner("right", "bottom"));

        // --------------------------------------------------------------------
        // APPEND TO CONTAINER
        // --------------------------------------------------------------------
        container.style.position = "relative";
        container.appendChild(this.element);

        // --------------------------------------------------------------------
        // EVENT HANDLERS
        // --------------------------------------------------------------------
        window.addEventListener("resize", () => this.onResize());

        // --------------------------------------------------------------------
        // INITIAL STATE
        // --------------------------------------------------------------------
        this.onResize();
        this.hide();
    }

    // ------------------------------------------------------------------------
    // EVENT: onResize
    // ------------------------------------------------------------------------
    // Adjusts overlay dimensions to match the canvas container.
    // ------------------------------------------------------------------------
    onResize() {
        this.element.style.width = this.container.clientWidth + "px";
        this.element.style.height = this.container.clientHeight + "px";
    }

    // ------------------------------------------------------------------------
    // VISIBILITY CONTROL
    // ------------------------------------------------------------------------
    show() { this.element.style.display = "block"; }
    hide() { this.element.style.display = "none"; }
    setVisible(visible) { this.element.style.display = visible ? "block" : "none"; }
}
