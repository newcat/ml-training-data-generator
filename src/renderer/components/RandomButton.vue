<template>
    <div>
        <span>Seed: {{ data.seed }}</span>
        <span>Random: {{ data.random }}</span>
        <button @click="generateRandomNumber">lel<button>
    </div>
</template>

<script>
export default {
    data: {
        seed: 100,
        random: 0
    },
    methods: {
        generateRandomNumber: () => {
            data.random = Math.random();
        }
    },
    created: () => {
        console.log("I got created!");
    }
}
</script>

<style>

</style>
