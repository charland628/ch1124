<script>
    import RentalForm from '../components/RentalForm.vue';

    export default {
        components: {
            'rental-form': RentalForm,
        },
    };
</script>

<template>
    <div class="container p-5 bg-dark text-white">
        <h1 class="text-center">Point of Sale Rent-a-Tool Form</h1>

        <div class="row pt-5">
            <div class="col-sm-12">
                This form is a point-of-sale rental form.
                Customers may rent a tool for a given time period, specifying both the checkout date and the return date.
                After checkout, a Rental Agreement will be produced.
                The store charges a daily rental fee, which depends on each tool type.
                Checkout date is a chargeable day, but the return date is not.
                Clerks may apply a discount that is applied to the total daily charges to reduce the final charge.
                Some tools are free of charge on weekends and holidays.
            </div>
        </div>

        <div class="row pt-3">
            <div class="col-sm-12">
                <p>
                    Please complete the information below to rent out equipment to your customer.
                </p>

                <rental-form />
            </div>
        </div>
    </div>
</template>
