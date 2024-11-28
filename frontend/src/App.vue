<script>
    import { RouterLink, RouterView } from 'vue-router';
    import apiService from './services/apis.js';

    export default {
        data() {
            return {
                tools: { data: null },
                toolCharges: { data: null },
                apisFetched: {
                    tools: false,
                    toolCharges: false,
                },
            };
        },

        provide() {
            return {
                tools: this.tools,
                toolCharges: this.toolCharges,
                apisFetched: this.apisFetched,
            };
        },

        async created() {
            this.tools.data = await apiService.getToolsMOCK();
            this.toolCharges.data = await apiService.getToolChargesMOCK();
            this.apisFetched.tools = true;
            this.apisFetched.toolCharges = true;
        },
    }
</script>

<template>
    <header>
        <div class="container px-5 py-1 my-1 bg-info text-white">
            <h1 class="text-bg-info text-center">Rent-a-Tool</h1>

            <div class="container-fluid">
                <nav class="navbar navbar-expand-sm bg-light justify-content-center">
                    <ul class="navbar-nav">
                        <RouterLink class="nav-item nav-link text-primary" to="/">Home</RouterLink>
                        <RouterLink class="nav-item nav-link text-primary" to="/rental-form">Point of Sale Rental Form</RouterLink>
                    </ul>
                </nav>
            </div>
        </div>
    </header>

    <RouterView />
</template>

<style scoped>
    a:hover {
        background-color: lightgray;
    }
    a.router-link-active {
        background-color: white;
    }
</style>
