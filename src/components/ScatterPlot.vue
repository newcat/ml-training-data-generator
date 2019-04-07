<template>
    <div class="chart-container" style="position: relative; height:100%; width:100%">
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

    mounted() {
        this.canvas = this.$refs.scatter as HTMLCanvasElement;
        this.canvas.width = 1000;
        this.canvas.height = 1000;
        this.context = this.canvas.getContext("2d");

        this.chart = new Chart(this.context!, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Scatter Dataset',
                    data: this.scatterPlotDataPoints
                }]
            },
            options: {
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

    @Watch("scatterPlotDataPoints")
    update() {
        const datasets = this.chart!.data!.datasets;
        if (datasets && datasets.length > 0) {
            datasets[0].data = this.scatterPlotDataPoints;
        } else {
            throw new Error("Undefined dataset");
        }
        this.chart!.update();
    }

    get scatterPlotDataPoints() {
        const data = this.data;
        const result: Array<{x: number, y: number}> = data.map((point) => {
            return {
                x: point[0],
                y: point[1]
            };
        });
        return result;
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

