<template>
    <div class="chart-container" style="position: relative; width: 100%; height: 70vh; max-height: 1000px;">
        <canvas
            ref="discreteCanvas"
            @mousedown="mouseDownHandler"
            @mousemove="mouseMoveHandler"
            @mouseup="mouseUpHandler"
            @mouseleave="mouseUpHandler"
            @contextmenu.prevent=""
        ></canvas>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Chart, { ChartData, ChartType, ChartConfiguration, ChartPoint, ChartElementsOptions, defaults } from "chart.js";

@Component
export default class DiscreteRandom extends Vue {

    @Prop()
    value!: number;

    @Prop()
    loadedValues!: number[];

    @Prop()
    min!: number;

    @Prop()
    max!: number;

    @Watch("min")
    onMinChanged(min: number, oldMin: number) {
        if (min < oldMin) {
            // Prepend items
            for (let i = min; i < oldMin; i++) {
                this.values.splice(0, 0, this.defaultValue);
            }
        } else if (min > oldMin) {
            // Delete items from start
            const numOfValues = min - oldMin;
            this.values.splice(0, numOfValues);
        }
        this.update();
    }

    @Watch("max")
    onMaxChanged(max: number, oldMax: number) {
        if (max > oldMax ) {
            // Append items
            for (let i = oldMax; i < max; i++) {
                this.values.push(this.defaultValue);
            }
        } else if (max < oldMax) {
            // Delete items from end
            const numOfValues = oldMax - max;
            this.values.splice(max, numOfValues);
        }
        this.update();
    }
    // Canvas
    canvas: HTMLCanvasElement|null = null;
    context: CanvasRenderingContext2D|null = null;
    chart!: Chart;

    // Data points
    values: number[] = [];
    lastMousePos: {x: number, y: number} = {x: 0, y: 0};

    // Chart configuration
    textColor: string = "white";
    axisColor: string = "rgba(100,100,100,0.8)";
    gridColor: string = "rgba(100,100,100,0.3)";
    barColor: string = "rgba(200,200,200,1)";
    defaultValue: number = 1;
    LMBClicked = false;

    // Chart options
    options: ChartConfiguration = {
        type: 'bar',
        data: {
            labels: this.chartLabels,
            datasets: [{
                label: 'Discrete Probability Distribution',
                data: this.values,
                borderColor: this.barColor,
                backgroundColor: this.areaColor,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: this.textColor,
                        beginAtZero: true,
                        min: 0,
                        max: 100,
                        stepSize: 10
                    },
                }]
            },
            tooltips: {
                callbacks: {
                    // Exclude title from tooltip
                    title: () => "",
                    // Create custom tooltip (X,Y)
                    label: (tooltipitem, data) => {
                        let label: string = "(";
                        label += tooltipitem.xLabel;
                        label += ",";
                        label += tooltipitem.yLabel;
                        label += ")";
                        return label;
                    }
                }
            },
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: this.textColor,
                }
            },
            animation: {
                duration: 0, // general animation time
            },
            hover: {
                animationDuration: 0, // duration of animations when hovering an item
            },
            responsiveAnimationDuration: 0, // animation duration after a resize
        }
    };

    mounted() {
        // Get canvas element via reference
        this.canvas = this.$refs.discreteCanvas as HTMLCanvasElement;

        // Set canvas size
        this.canvas!.width = 1000;
        this.canvas!.height	= 1000;

        // Setup Chart
        this.context = this.canvas!.getContext("2d");
        this.chart = new Chart(this.context!, this.options);

        // Setup values
        this.setupPoints();
    }

    setupPoints() {
        // Keep loaded points within bounds and copy them
        this.values = [];
        this.loadedValues.forEach((value) => {
            const v = value < 0 ? 0 : value > 100 ? 100 : value;
            this.values.push(v);
        });

        // Guarantee that length matches min max
        const length = this.values.length;
        const newLength = this.max - this.min + 1;
        if (newLength < length) {
            // Delete items
            this.values.splice(newLength - 1, length - newLength);
        } else if (newLength > length) {
            // Add items
            const numOfItems = newLength - length;
            for (let i = 0; i < numOfItems; i++) {
                this.values.push(1);
            }
        }

        this.setChartData(this.values);

        // Update editor
        this.update();
    }

    setChartData(data: number[]) {
        const datasets = this.chart!.data!.datasets;
        if (datasets && datasets.length > 0) {
            datasets[0]!.data = data;
        }
    }

    update() {
        this.chart.data.labels = this.chartLabels;
        this.chart.data.datasets![0].data = this.values;
        // Update chart
        this.chart!.update();
    }

    setBars(e: MouseEvent) {
        const mousePos = this.getPointFromChart(e);
        const lastMousePos = this.lastMousePos;

        // Determine from to
        let startPos;
        let endPos;
        if (lastMousePos.x <= mousePos.x) {
            startPos = lastMousePos;
            endPos = mousePos;
        } else {
            startPos = mousePos;
            endPos = lastMousePos;
        }

        // Linear interpolate start and end pos
        const x1 = startPos.x;
        const x2 = endPos.x;
        const y1 = startPos.y;
        const y2 = endPos.y;
        const m = (x2 - x1) === 0 ? 0 : (y2 - y1) / (x2 - x1);
        const c = y1 - m * x1;
        for (let i = x1; i <= x2; i++) {
            // Update y value of point at current x value
            this.values[i] = m * i + c;
        }

        // Update last mouse pos
        this.lastMousePos = mousePos;
        this.chart!.update();
    }

    setBarToMouse(pos: {x: number, y: number}) {
        // Set limits of chart
        pos.y = pos.y < 0 ? 0 : pos.y;
        pos.y = pos.y > 100 ? 100 : pos.y;
        pos.x = pos.x < 0 ? 0 : pos.x;
        pos.x = pos.x > this.values.length - 1 ? this.values.length - 1 : pos.x;

        // Update y value of point at current x value
        this.values[Math.floor(pos.x)] = pos.y;
        this.update();
    }

    mouseDownHandler(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        // Keep track on left click state
        if (e.button === 0) {
            this.LMBClicked = true;
            const mousePos = this.getPointFromChart(e);
            this.setBarToMouse(mousePos);
            this.lastMousePos = mousePos;
        }

        this.update();
    }

    mouseMoveHandler(e: MouseEvent) {
        // On mouse left click
        if (this.LMBClicked) {
            this.setBars(e);
        }
    }

    mouseUpHandler(e: MouseEvent) {
        // Reset state
        if (e.button === 0) {
            this.LMBClicked = false;
        }

        // Emit update event whenever the points have been changed by either adding, removing or moving, update
        this.$emit("valuesUpdated", this.values);
    }

    getPointFromChart(e: MouseEvent) {
        const scales: any = (this.chart as Chart.ChartOptions).scales;
        const scaleX = scales["x-axis-0"];
        const valueX = scaleX.getValueForPixel(e.offsetX);
        const scaleY = scales["y-axis-0"];
        const valueY = scaleY.getValueForPixel(e.offsetY);
        return {x: parseInt(valueX, 10), y: parseInt(valueY, 10)};
    }

    get chartLabels() {
        const labels: string[] = [];
        for (let i = this.min; i <= this.max; i++) {
            labels.push(i.toString());
        }
        return labels;
    }

    // Calculate a brighter color from curveColor
    get areaColor() {
        const rgba = new RegExp(/rgba\((\d*),(\d*),(\d*),(\d*)\)/, "gi").exec(this.barColor);
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
