<template>
    <canvas ref="canvas"
    ></canvas>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import CurveMonotone from "./curveMonotone";
import RandomSampler from "./randomSampler";

@Component
export default class CustomRandom extends Vue {

    @Prop()
    value!: number;

    @Prop()
    loadedPoints!: Array<[number, number]>;

    @Prop({default: "curveMonotoneX"})
    mode!: string;

    // State
    canvas!: HTMLCanvasElement;
    context!: CanvasRenderingContext2D|null;
    points: Array<[number, number]> = [];
    interpolatedPoints: Array<[number, number]> = [];
    draggedPoint: [number, number]|null = null;
    curveMonotone!: CurveMonotone;
    clicked: boolean = false;
    selectedPoint: [number, number]|null = null;
    startPoint!: [number, number];
    endPoint!: [number, number];
    isMounted: boolean = false;
    isPaused: boolean = false;

    // Curve configuration
    stepSize: number = 1; // Accuracy of interpolation
    curveSelectionOffsetX: number = 10;
    curveSelectionOffsetY: number = 1000;
    pointRadius: number = 10;
    curveColor: string = "rgba(250,250,250,1)";

    // Axis configuration
    origin!: [number, number];
    gridSize: number = 20; // length of a cell's edge
    gridColor = "rgba(100,100,200,0.1)";
    axisColor = "rgba(100,100,100,1)";

    mounted() {
        // Get canvas element
        this.canvas = this.$refs.canvas as HTMLCanvasElement;
        this.context = this.canvas.getContext("2d");

        // To preserve responsiveness, canvas is set to 100% width regarding parent container element.
        // The height will be dependend on the actual canvas resolution / ratio.
        this.canvas!.width = 1000;
        this.canvas!.height	= 1000;

        // Set graph origin
        this.origin = [50, this.canvas.height - 50];

        // Setup points, startPoint, endPoint from loadedPoints
        this.setupPoints();

        // Attach event listeners
        this.canvas.onmousedown = this.mouseDownHandler;
        this.canvas.onmousemove = this.mouseMoveHandler;
        this.canvas.onmouseup = this.mouseUpHandler;
        this.canvas.onmouseleave = this.mouseUpHandler;
        this.canvas.oncontextmenu = (e) => { e.preventDefault(); };

        // set isMounted for watchers
        this.isMounted = true;
    }

    @Watch("loadedPoints")
    setupPoints() {
        // Copy loaded points that are within bounds
        const points: Array<[number, number]> = [];
        this.loadedPoints.forEach((point) => {
            if (point[0] >= 0 &&
                point[0] <= this.editorBounds.right - this.editorBounds.left &&
                point[1] >= 0 &&
                point[1] <= this.editorBounds.bottom - this.editorBounds.top) {
                points.push(point.slice() as [number, number]);
            }
        });

        let foundStartPoint: [number, number]|null = null;
        let foundEndPoint: [number, number]|null = null;
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
            this.startPoint = foundStartPoint;
            points.push(foundStartPoint);
        }
        if (!foundEndPoint) {
            foundEndPoint = [this.editorBounds.right - this.editorBounds.left, 0];
            this.endPoint = foundEndPoint;
            points.push(foundEndPoint);
        }

        // Pass points to this.points only at the end to prevent spamming watchers
        this.points = points;

        // Update editor
        this.update();
    }

    update() {
        // Interpolate points
        this.curveMonotone = new CurveMonotone(this.points);
        this.interpolatedPoints = this.curveMonotone.curve(0, this.canvas.width - 2 * this.origin[0], this.stepSize);

        // Reset canvas
        this.context!.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw x- and y-axis
        this.context!.beginPath();
        this.context!.moveTo(this.origin[0], this.canvas.height);
        this.context!.lineTo(this.origin[0], this.editorBounds.top);
        this.context!.moveTo(0, this.origin[1]);
        this.context!.lineTo(this.editorBounds.right, this.origin[1]);
        this.context!.strokeStyle = this.axisColor;
        this.context!.stroke();
        this.context!.closePath();

        // Draw vertical grid lines
        this.context!.beginPath();
        for (let x = this.editorBounds.left; x <= this.editorBounds.right; x += this.gridSize) {
            this.context!.moveTo(x, this.editorBounds.bottom);
            this.context!.lineTo(x, this.editorBounds.top);
        }
        for (let y = this.editorBounds.top; y <= this.editorBounds.bottom; y += this.gridSize) {
            this.context!.moveTo(this.editorBounds.left, y);
            this.context!.lineTo(this.editorBounds.right, y);
        }
        this.context!.strokeStyle = this.gridColor;
        this.context!.stroke();
        this.context!.closePath();

        // Draw interpolation graph
        this.context!.beginPath();
        this.context!.moveTo(this.origin[0], this.origin[1]);
        this.interpolatedPoints.forEach((point) => {
            this.context!.lineTo(this.mx(point[0]), this.my(point[1]));
        });
        this.context!.lineTo(this.canvas.width - this.origin[0], this.origin[1]);

        // save the un-clipped context state
        this.context!.save();

        // Create a clipping area from the path
        // All new drawing will be contained inside
        // the clipping area
        this.context!.clip();

        // fill some of the clipping area
        this.context!.fillStyle = this.areaColor;
        this.context!.fillRect(this.origin[0], 0, this.canvas.width - this.origin[0], this.origin[1]);

        // restore the un-clipped context state
        // (the clip is un-done)
        this.context!.restore();

        this.context!.strokeStyle = this.curveColor;
        this.context!.stroke();
        this.context!.closePath();

        // Draw points
        this.points.forEach((point, index) => {
            this.context!.beginPath();
            this.context!.arc(this.mx(point[0]), this.y(point[1]), this.pointRadius, 0, 2 * Math.PI);
            this.context!.fillStyle = this.curveColor;
            this.selectedPoint === point ? this.context!.fill() : this.context!.stroke();
            this.context!.closePath();
        });

        const randomSampler = new RandomSampler(this.interpolatedPoints);
        randomSampler.calculateCdf();
        randomSampler.scaleCdf(this.editorBounds.bottom - this.editorBounds.top);

        // Draw cdf
        this.context!.beginPath();
        this.context!.moveTo(this.origin[0], this.origin[1]);
        randomSampler.cdf.forEach((point) => {
            this.context!.lineTo(this.mx(point[0]), this.my(point[1]));
        });
        this.context!.lineTo(this.canvas.width - this.origin[0], this.origin[1]);
        this.context!.strokeStyle = "rgba(100,0,0,0.5)";
        this.context!.stroke();
        this.context!.closePath();
    }

    distance(a: [number, number], b: [number, number]) {
        return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
    }

    mouseDownHandler(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        const mousePos = this.getMousePos(e);

        // Check for collision with point within radius
        const collision = this.points.find((point) => {
            return Math.sqrt(Math.pow(this.mx(point[0]) - mousePos[0], 2) +
                Math.pow(this.my(point[1]) - mousePos[1], 2)) < 10;
        });

        // Save point reference as dragged element
        if (collision) {
            this.draggedPoint = collision;
        }

        // Add point on double left click
        if (e.button === 0) {
            const currY = this.curveMonotone.interpolate(this.x(mousePos[0]));
            if (Math.abs(this.my(currY) - mousePos[1]) < this.curveSelectionOffsetY) {
                // Double click registered on curve
                if (this.clicked) {
                    this.clicked = false;
                    const newPoint: [number, number] =  [this.x(mousePos[0]), currY];
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

        this.update();
    }

    mouseUpHandler(e: MouseEvent) {
        // Release point by resetting draggedPoint
        this.draggedPoint = null;

        // Emit update event whenever the points have been changed by either adding, removing or moving, update
        this.$emit('pointsUpdated', this.points);
    }

    // Convert mouse position to its actual position in the canvas
    // https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
    getMousePos(evt: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect(); // abs. size of element
        const scaleX = this.canvas.width / rect.width;    // relationship bitmap vs. element for X
        const scaleY = this.canvas.height / rect.height;  // relationship bitmap vs. element for Y

        return [
            (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
            (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
        ];
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

    // Xs and Ys bounds of the editor
    get editorBounds() {
        return {
            left: this.origin[0],
            right: this.canvas.width - this.origin[0],
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
