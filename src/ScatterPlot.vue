<template>
    <canvas 
        ref="scatter"
    ></canvas>
</template>
<script lang="ts">
import Vue from "vue";
import Chart from "chart.js";
import { Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class ScatterPlot extends Vue {
    
    @Prop()
    x!: number[];
    
    @Prop()
    y!: number[];

    canvas: HTMLCanvasElement|null = null;
    context: CanvasRenderingContext2D|null = null;
    chart: Chart|null = null;

    mounted() {
        this.canvas = this.$refs.scatter as HTMLCanvasElement;
        this.canvas.width = 1000;
        this.canvas.height = 1000;
        this.context = this.canvas.getContext("2d");
        this.update();
    }
    
    @Watch("x")
    @Watch("y")
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
                    xAxes: [{
                        type: 'linear',
                        position: 'bottom'
                    }]
                }
            }
        });
    }

    ScatterPlotDataPoints() {
        const x = this.x;
        const y = this.y;
        console.log(x, y);
        let data: Array<{x: number, y: number}> = [];
        for(let i = 0; i < x.length; i++) {
            data.push({
                x: x[i],
                y: y[i]
            });
        }
        return data;
    }
}
</script>
<style>
canvas {
    box-shadow: 0px 0px 40px -5px rgba(0,0,0,0.3);
    border-radius: 5px;
    width: 100%;
}
</style>

