<template>
    <canvas
        ref="canvas"
        @mousedown="mouseDownHandler"
        @mousemove="mouseMoveHandler"
        @mouseup="mouseUpHandler"
        @mouseleave="mouseUpHandler"
        @contextmenu.prevent=""
    ></canvas>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Curve, { Vector2D } from "./curve";
import CurveMonotone from "./curveMonotone";
import CurveStep from "./curveStep";
import CurveLinear from "./curveLinear";
import RandomSampler from "./randomSampler";
import CanvasHelper from "./CanvasHelper";

@Component
export default class CustomRandom extends Vue {

    @Prop()
    value!: number;

    @Prop()
    loadedPoints!: Vector2D[];

    @Prop({default: "curveMonotone"})
    mode!: string;

    @Prop()
    min!: number;

    @Prop()
    max!: number;

    @Watch("loadedPoints")
    onLoadedPointsChanged() {
        this.setupPoints();
    }

    @Watch("min")
    onMinChanged() {
        this.update();
    }

    @Watch("max")
    onMaxChanged() {
        this.update();
    }

    // Canvas
    canvas: HTMLCanvasElement|null = null;
    context: CanvasRenderingContext2D|null = null;
    canvasHelper: CanvasHelper|null = null;

    // Data points
    points: Vector2D[] = [];
    interpolatedPoints: Vector2D[] = [];
    draggedPoint: Vector2D|null = null;
    selectedPoint: Vector2D|null = null;
    startPoint: Vector2D|null = null;
    endPoint: Vector2D|null = null;
    mousePosition: Vector2D = [0, 0];

    // Curve
    curve: Curve|null = null;

    // Curve configuration
    curveSelectionOffsetX: number = 10;
    curveSelectionOffsetY: number = 1000;
    pointRadius: number = 10;
    curveColor: string = "rgba(250,250,250,1)";

    // Axis configuration
    origin!: Vector2D;
    gridSize: number = 20; // length of a cell's edge
    gridColor = "rgba(100,100,200,0.1)";
    axisColor = "rgba(100,100,100,1)";
    cdfColor = "rgba(190, 220, 250, 0.8";

    // Click state
    clicked: boolean = false;

    mounted() {
        // Get canvas element
        this.canvas = this.$refs.canvas as HTMLCanvasElement;
        this.context = this.canvas!.getContext("2d");
        this.canvasHelper = new CanvasHelper(this.canvas, this.context!);

        // To preserve responsiveness, canvas is set to 100% width regarding parent container element.
        // The height will be dependend on the actual canvas resolution / ratio.
        this.canvas!.width = 1000;
        this.canvas!.height	= 1000;

        // Set graph origin
        this.origin = [50, this.canvas!.height - 50];

        // Setup points, startPoint, endPoint from loadedPoints
        this.setupPoints();
    }

    setupPoints() {
        // Copy loaded points that are within bounds
        const points: Vector2D[] = [];
        this.loadedPoints.forEach((point) => {
            if (point[0] >= 0 &&
                point[0] <= this.editorBounds.right - this.editorBounds.left &&
                point[1] >= 0 &&
                point[1] <= this.editorBounds.bottom - this.editorBounds.top) {
                points.push(point.slice() as Vector2D);
            }
        });

        // Setup references to start and end point
        let foundStartPoint: Vector2D|null = null;
        let foundEndPoint: Vector2D|null = null;
        points.forEach((point) => {
            if (!foundStartPoint && point[0] === 0) {
                foundStartPoint = point;
            }
            if (!foundEndPoint && point[0] === this.editorBounds.right - this.editorBounds.left) {
                foundEndPoint = point;
            }
        });

        if (!foundStartPoint) {
            foundStartPoint = [0, 0];
            points.push(foundStartPoint);
        }
        if (!foundEndPoint) {
            foundEndPoint = [this.editorBounds.right - this.editorBounds.left, 0];
            points.push(foundEndPoint);
        }
        this.startPoint = foundStartPoint;
        this.endPoint = foundEndPoint;

        // Pass points to this.points only at the end to prevent spamming watchers
        this.points = points;

        // Update editor
        this.update();
    }

    update() {
        const canvasHelper = this.canvasHelper!;

        // Set curve interpolator
        switch (this.mode) {
            case "curveMonotone": {
                this.curve = new CurveMonotone(this.points);
                break;
            }
            case "curveLinear": {
                this.curve = new CurveLinear(this.points);
                break;
            }
            case "curveStepMid": {
                this.curve = new CurveStep(this.points, "mid");
                break;
            }
            case "curveStepAfter": {
                this.curve = new CurveStep(this.points, "after");
                break;
            }
            case "curveStepBefore": {
                this.curve = new CurveStep(this.points, "before");
                break;
            }
            default: {
                throw new Error("Invalid mode");
            }
        }
        this.interpolatedPoints = this.curve!.curve();

        // Reset canvas
        canvasHelper.clear();

        // Draw x- and y-axis
        canvasHelper.drawAxis(this.editorBounds, this.axisColor);

        // Draw axis labels
        const currentX = this.x(this.mousePosition[0]) / this.endPoint![0] * (this.max - this.min) + this.min;
        canvasHelper.drawMarkers(this.min, this.max, currentX, this.editorBounds);

        // Draw vertical grid lines
        canvasHelper.drawGrid(this.editorBounds, this.gridSize, this.gridSize, this.gridColor);

        // Draw interpolation graph
        const transformedInterpolatedPoints = this.pointsToCanvas(this.interpolatedPoints);
        canvasHelper.drawFilledCurve(transformedInterpolatedPoints, this.editorBounds, this.curveColor, this.areaColor);

        // Draw points
        const transformedPoints = this.pointsToCanvas(this.points);
        canvasHelper.drawPoints(transformedPoints, this.selectedPoint, this.curveColor, this.pointRadius);

        // Calculate cdf
        const randomSampler = new RandomSampler(this.interpolatedPoints);
        randomSampler.calculateCdf();
        randomSampler.scaleCdf(this.editorBounds.bottom - this.editorBounds.top);

        // Draw cdf
        const transformedCdf = this.pointsToCanvas(randomSampler.cdf);
        canvasHelper.drawCurve(transformedCdf, this.cdfColor);

        // Draw label for cdf
        canvasHelper.drawLabel("cummulative distribution function (cdf)",
            this.editorBounds.right, this.editorBounds.top, this.cdfColor, "right");

        // Draw crosshair
        canvasHelper.drawCrosshair(this.mousePosition[0], this.mousePosition[1]);
    }

    mouseDownHandler(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        const mousePos = this.getMousePos(e);

        // Check for collision with point within radius
        const collision = this.points.find((point) => {
            return this.distance([this.mx(point[0]), this.my(point[1])], [mousePos[0], mousePos[1]]) < this.pointRadius;
        });

        // Save point reference as dragged element
        if (collision) {
            this.draggedPoint = collision;
        }

        // Add point on double left click
        if (e.button === 0) {
            // Get curve's interpolated y coordinate at mouse position x
            const x = this.x(mousePos[0]);
            const y = this.curve!.interpolate(x);

            // Check if mouse y is near enough
            if (Math.abs(this.my(y) - mousePos[1]) < this.curveSelectionOffsetY) {
                // Double click registered on curve
                if (this.clicked) {
                    this.clicked = false;
                    const newPoint: Vector2D =  [this.x(mousePos[0]), y];
                    if (!this.points.find((point) => point[0] === newPoint[0] && point[1] === newPoint[1])) {
                        this.points.push(newPoint);
                        this.update();
                    }
                } else {
                    this.clicked = true;
                    setTimeout(() => { this.clicked = false; }, 500);
                }
            }
        }

        // Remove point on right click
        if (e.button === 2) {
            const found = this.points.findIndex((point) => {
                return Math.abs(this.mx(point[0]) - mousePos[0]) < this.curveSelectionOffsetX
                    && Math.abs(this.my(point[1]) - mousePos[1]) < this.curveSelectionOffsetY;
                });
            if (found >= 0 && this.points[found] !== this.startPoint && this.points[found] !== this.endPoint) {
                this.points.splice(found, 1);
                this.update();
            }
        }
    }

    mouseMoveHandler(e: MouseEvent) {
        const mousePos = this.getMousePos(e);

        // Drag point that has been selected with mouse down.
        // draggesPoint is a reference to a point in the points array.
        // If draggedPoints gets changed, this.points will change and trigger update event via watcher!
        if (this.draggedPoint) {
            if (this.draggedPoint !== this.startPoint && this.draggedPoint !== this.endPoint) {
                if (mousePos[0] <= this.editorBounds.left) {
                    this.draggedPoint[0] = this.x(this.editorBounds.left + 0.01);
                } else if (mousePos[0] >= this.editorBounds.right) {
                    this.draggedPoint[0] = this.x(this.editorBounds.right - 0.01);
                } else {
                    this.draggedPoint[0] = this.x(mousePos[0]);
                }
            }
            if (mousePos[1] >= this.editorBounds.bottom) {
                this.draggedPoint[1] = this.y(this.editorBounds.bottom);
            } else if (mousePos[1] <= this.editorBounds.top) {
                this.draggedPoint[1] = this.y(this.editorBounds.top);
            } else {
                this.draggedPoint[1] = this.y(mousePos[1]);
            }
        }

        // Check for collision with points within radius
        const collision = this.points.find((point) => {
            return Math.sqrt(Math.pow(this.mx(point[0]) - mousePos[0], 2) +
                Math.pow(this.my(point[1]) - mousePos[1], 2)) < 10;
        });
        if (collision) {
            this.selectedPoint = collision;
        } else {
            this.selectedPoint = null;
        }

        // Update crosshair position
        this.mousePosition = mousePos;

        this.update();
    }

    mouseUpHandler(e: MouseEvent) {
        // Release point by resetting draggedPoint
        this.draggedPoint = null;

        // Emit update event whenever the points have been changed by either adding, removing or moving, update
        this.$emit("pointsUpdated", this.points);
    }

    // Convert mouse position to its actual position in the canvas
    // https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
    getMousePos(evt: MouseEvent) {
        const rect = this.canvas!.getBoundingClientRect(); // abs. size of element
        const scaleX = this.canvas!.width / rect.width;    // relationship bitmap vs. element for X
        const scaleY = this.canvas!.height / rect.height;  // relationship bitmap vs. element for Y

        return [
            (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
            (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
        ] as Vector2D;
    }

    // Map an x-coordinate to its actual position in the editor
    mx(x: number) {
        return x + this.origin[0];
    }

    // Map an y-coordinate to its actual position in the editor
    my(y: number) {
        return this.origin[1] - y;
    }

    // Inverse of mx
    x(mx: number) {
        return mx - this.origin[0];
    }

    // Inverse of _<
    // @ts-ignore
    y(my: number) {
        return this.origin[1] - my;
    }

    pointsToCanvas(points: Vector2D[]) {
        const transformedPoints: Vector2D[] = [];
        points.forEach((point) => {
            transformedPoints.push([this.mx(point[0]), this.my(point[1])]);
        });
        return transformedPoints;
    }

    distance(a: Vector2D, b: Vector2D) {
        return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
    }

    // Xs and Ys bounds of the editor
    get editorBounds() {
        return {
            left: this.origin[0],
            right: this.canvas!.width - this.origin[0],
            bottom: this.origin[1],
            top: 50
        };
    }

    // Calculate a brighter color from curveColor
    get areaColor() {
        const rgba = new RegExp(/rgba\((\d*),(\d*),(\d*),(\d*)\)/, "gi").exec(this.curveColor);
        if (rgba) {
            return "rgba(" + rgba[1] + "," + rgba[2] + "," + rgba[3] + "," + 0.1 + ")";
        } else {
            return "rgba(255,255,255,255)";
        }
    }
}
</script>
<style>
body {
    font-family: "Helvetica Neue", Helvetica, sans-serif;
    font-size: 12px;
    user-select: none;
}
canvas {
    box-shadow: 0px 0px 40px -5px rgba(0,0,0,0.3);
    border-radius: 5px;
    width: 100%;
}
</style>
