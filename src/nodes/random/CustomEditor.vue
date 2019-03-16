<template>
    <div>
        <p>
        {{type}}
        {{dataPoints}}
        </p>
        <button @click="test" class="dark-button mt-3 w-100">Your Mom Gay</button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default class CustomEditor extends Vue {
    type =  "column";
    dataPoints = [
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

    test() {
        console.log("Your Dad Gay");
    }
}
</script>