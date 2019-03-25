import { Vector2D } from "./curve";

export default class CanvasHelper {

    canvas: HTMLCanvasElement|null = null;
    context: CanvasRenderingContext2D|null = null;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.context = context;
    }

    drawCurve(points: Vector2D[], color: string) {
        this.context!.beginPath();
        this.context!.moveTo(points[0][0], points[0][1]);
        points.forEach((point) => {
            this.context!.lineTo(point[0], point[1]);
        });
        this.context!.strokeStyle = color;
        this.context!.stroke();
        this.context!.closePath();
    }

    drawFilledCurve(points: Vector2D[], bounds: any, curveColor: string, areaColor: string) {
        this.context!.beginPath();
        this.context!.moveTo(bounds.left, bounds.bottom);
        points.forEach((point) => {
            this.context!.lineTo(point[0], point[1]);
        });
        this.context!.lineTo(bounds.right, bounds.bottom);

        // Save the un-clipped context state
        this.context!.save();

        // Create a clipping area from the path
        // All new drawing will be contained inside
        // the clipping area
        this.context!.clip();

        // Fill some of the clipping area
        this.context!.fillStyle = areaColor;
        this.context!.fillRect(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top);

        // Restore the un-clipped context state
        // (the clip is un-done)
        this.context!.restore();

        this.context!.strokeStyle = curveColor;
        this.context!.stroke();
        this.context!.closePath();

    }

    drawPoints(points: Vector2D[], selectedPoint: Vector2D|null, color: string, radius: number) {
        points.forEach((point, index) => {
            this.context!.beginPath();
            this.context!.arc(point[0], point[1], radius, 0, 2 * Math.PI);
            this.context!.fillStyle = color;
            selectedPoint === point ? this.context!.fill() : this.context!.stroke();
            this.context!.closePath();
        });
    }

    drawAxis(bounds: any, color: string) {
        this.context!.beginPath();
        this.context!.moveTo(bounds.left, bounds.bottom);
        this.context!.lineTo(bounds.left, bounds.top);
        this.context!.moveTo(0, bounds.bottom);
        this.context!.lineTo(bounds.right, bounds.bottom);
        this.context!.strokeStyle = color;
        this.context!.stroke();
        this.context!.closePath();
    }

    drawMarkers(min: number, max: number, x: number, bounds: any) {
        this.context!.font = "30px Arial";
        this.context!.textAlign = "right";
        this.context!.fillStyle = "white";
        this.context!.fillText(max.toString(), bounds.right, bounds.bottom + 30);
        this.context!.textAlign = "left";
        this.context!.fillText(min.toString(), bounds.left, bounds.bottom + 30);
        this.context!.textAlign = "left";
        this.context!.fillText("x: " + x.toString(), bounds.left, bounds.top);
    }

    drawLabel(text: string, x: number, y: number, color: string, align: CanvasTextAlign) {
        this.context!.font = "30px Arial";
        this.context!.fillStyle = color;
        this.context!.textAlign = align;
        this.context!.fillText(text, x, y);
    }

    drawGrid(bounds: any, sizeX: number, sizeY: number, color: string) {
        this.context!.beginPath();
        for (let x = bounds.left; x <= bounds.right; x += sizeX) {
            this.context!.moveTo(x, bounds.bottom);
            this.context!.lineTo(x, bounds.top);
        }
        for (let y = bounds.top; y <= bounds.bottom; y += sizeY) {
            this.context!.moveTo(bounds.left, y);
            this.context!.lineTo(bounds.right, y);
        }
        this.context!.strokeStyle = color;
        this.context!.stroke();
        this.context!.closePath();
    }

    drawCrosshair(x: number, y: number) {
        this.context!.setLineDash([50, 30]); // Dashes are 5px and spaces are 3px
        this.context!.beginPath();
        this.context!.moveTo(x, 0);
        this.context!.lineTo(x, this.canvas!.height);
        this.context!.moveTo(0, y);
        this.context!.lineTo(this.canvas!.width, y);
        this.context!.strokeStyle = "rgba(100,100,100,1)";
        this.context!.stroke();
        this.context!.closePath();
        this.context!.setLineDash([]);
    }

    clear() {
        this.context!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    }

}
