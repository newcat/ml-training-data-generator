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

    @Prop()
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
        this.update();
    }

    @Watch("data")
    update() {
        this.chart = new Chart(this.context!, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Scatter Dataset',
                    data: this.ScatterPlotDataPoints()
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
                }
            }
        });
    }

    ScatterPlotDataPoints() {
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

