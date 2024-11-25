<template>
    <div class="container p-5 text-bg-dark">
        <h1 class="text-center">Welcome to Rent-a-Tool</h1>

        <div class="row py-5">
            <div class="col-sm-2">
                <img
                    src="../assets/saw.png"
                    class="img-fluid"
                    alt="drawing of a handsaw"
                />
            </div>
            <div class="col-sm-8">
                <p>
                    From this application, you may rent a large variety of tools for your personal or business use.
                    Tools must be returned undamaged to avoid extra charges.
                    Tools should not be used by children under 2 years of age.
                </p>
                <p>
                    To rent a tool, navigate to the tool <strong>Point of Sale Rental Form</strong> button above or
                    <RouterLink class="nav-item nav-link" to="/rental-form">click here</RouterLink>.
                </p>
            </div>
            <div class="col-sm-2">
                <img
                    src="../assets/ladder.png"
                    class="img-fluid"
                    alt="drawing of a ladder"
                />
            </div>
        </div>

        <p class="text-bg-warning text-center">
            <strong>Note: due to government regulations, we are no longer able to rent out nuclear bombs.</strong>
        </p>
    </div>
</template>

<style scoped>
    a {
        display: inline-block;
        color: aqua;
    }
    a:hover {
        color: blue;
    }
</style>
