<template>
    <div>
        <p>
        {{lol}}
        </p>
        <svg
            :height="500" 
            :width="'100%'">
            <path :d="'M0 0 L100 0 L50 100 Z'" />
            <rect 
                :width="'100%'"
                :height="'100%'"
                :fill="'pink'"
             />
        </svg>
        <button @click="test" class="dark-button mt-3 w-100">Your Mom Gay</button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';
import * as d3 from 'd3';

@Component
export default class CustomEditor extends Vue {

    @Prop() width!: number;
    @Prop() height!: number;
    @Prop() dataPoints!: any;

    
    lol = [
        { x: 10, y: 71 },
        { x: 20, y: 55 },
        { x: 30, y: 50 },
        { x: 40, y: 65 },
        { x: 50, y: 95 },
        { x: 60, y: 68 },
        { x: 70, y: 28 },
        { x: 80, y: 34 },
        { x: 90, y: 14 }
    ];

    mounted() {
        console.log("mounted");
    }

    test() {
        console.log("Your Dad Gay");
    }
}
</script>