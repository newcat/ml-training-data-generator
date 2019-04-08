<template>
    <div class="chart-container" style="position: relative; width: 100%; height: 70vh; max-height: 1000px;">
        <canvas
            ref="scatter"
        ></canvas>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import Chart from "chart.js";
import { Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class ScatterPlot extends Vue {

    @Prop({ default: [] })
    data!: Array<[number, number]>;

    canvas: HTMLCanvasElement|null = null;
    context: CanvasRenderingContext2D|null = null;
    chart: Chart|null = null;

    textColor: string = "white";
    axisColor: string = "rgba(100,100,100,0.8)";
    gridColor: string = "rgba(100,100,100,0.3)";

    minRadius: number = 1;
    maxRadius: number = 10;
    hoverRadiusIncreasement: number = 2;

    mounted() {
        this.canvas = this.$refs.scatter as HTMLCanvasElement;
        this.canvas.width = 1000;
        this.canvas.height = 1000;
        this.context = this.canvas.getContext("2d");

        const t = this;
        this.chart = new Chart(this.context!, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Scatter Dataset',
                    data: this.analyzedData.points,
                    pointRadius: this.radiusVector,
                    pointHoverRadius: this.radiusVector.map((r) => r * this.hoverRadiusIncreasement)
                }],
            },
            options: {
                responsive: true,
                tooltips: {
                    callbacks: {
                        afterLabel(tooltipitem, data) {
                            if (tooltipitem.index) {
                                return t.analyzedData.occurrences[tooltipitem.index!] + "x";
                            } else {
                                return "0x";
                            }
                        }
                    }
                },
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            fontColor: this.textColor,
                            beginAtZero: true
                        },
                        gridLines: {
                            color: this.gridColor,
                            zeroLineColor: this.axisColor
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontColor: this.textColor,
                            beginAtZero: true
                        },
                        gridLines: {
                            color: this.gridColor,
                            zeroLineColor: this.axisColor
                        }
                    }],
                },
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        fontColor: this.textColor,
                    }
                },
                elements: {
                    point: {
                        borderColor: "white",
                        backgroundColor: "#C3C3C3"
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
        });
    }

    @Watch("analyzedData")
    update() {
        const datasets = this.chart!.data!.datasets;
        if (datasets && datasets.length > 0) {
            datasets[0].data = this.analyzedData.points;
            datasets[0].pointRadius = this.radiusVector;
            datasets[0].pointHoverRadius = this.radiusVector.map((r) => r + this.hoverRadiusIncreasement);
        } else {
            throw new Error("Undefined dataset");
        }
        this.chart!.update();
    }

    get analyzedData() {
        const data = this.data;
        const hash: any = {};
        const pointVector: Array<{x: number, y: number}> = [];
        let maxOccurrences = 1;
        for (let i = 0, l = data.length; i < l; i++) {
            const pointKey = data[i].join('|');
            if (!hash[pointKey]) {
                const point = { x: data[i][0], y: data[i][1] };
                const index = pointVector.push(point) - 1;
                hash[pointKey] = [1, index];
            } else {
                hash[pointKey][0]++;
                if (hash[pointKey][0] > maxOccurrences) {
                    maxOccurrences = hash[pointKey][0];
                }
            }
        }
        const radiusVector: number[] = new Array(pointVector.length);
        for (const pointKey in hash) {
            if (hash.hasOwnProperty(pointKey)) {
                const pointData = hash[pointKey];
                radiusVector[pointData[1]] = pointData[0];
            }
        }
        return { points: pointVector, occurrences: radiusVector, maxOccurrences };
    }

    get radiusVector() {
        const maxOccurrences = this.analyzedData.maxOccurrences;
        return this.analyzedData.occurrences.map(
            (x) => this.minRadius + (x / maxOccurrences) * (this.maxRadius - this.minRadius)
        );
    }

}
</script>
<style>
canvas {
    box-shadow: 0px 0px 40px -5px rgba(0,0,0,0.3);
    border-radius: 5px;
    background-color: "#C3C3C3";
    width: 100%;
}
</style>

