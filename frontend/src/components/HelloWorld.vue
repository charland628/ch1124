<script>
    export default {
        data() {
            return {
                name: 'ABC',
            };
        },
        props: {
            msg: {
                type: String,
                required: true,
            },
        },
    };
</script>

<template>
    <div class="greetings">
        <h1 class="green">{{name}} {{ msg }}</h1>
    </div>
</template>

<style>
</style>
