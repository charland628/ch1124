<template>
    <div class="row pt-1">
        <div class="col-sm-12 text-bg-secondary">
            <form v-on:submit.prevent="submitRental">
                <div class="p-2">
                    <form-select
                        label="Select one of the following tools"
                        :id="toolSelect.id"
                        :name="toolSelect.name"
                        :required="toolSelect.required"
                        :options="toolSelect.options"
                        :placeholder="toolSelect.placeholder"
                        :value="toolSelect.value"
                        @select-changed-value="handleChangedInputValue"
                    />
                </div>
                <div class="p-2">
                    <form-date-input
                        label="Please choose a checkout date"
                        :id="checkoutDateInput.id"
                        :name="checkoutDateInput.name"
                        :min="todayAsString"
                        :required="checkoutDateInput.required"
                        :value="checkoutDateInput.value"
                        @input-changed-value="handleChangedInputValue"
                    />
                </div>
                <div class="p-2">
                    <form-date-input
                        label="Please choose a return date (at least one day in future)"
                        :id="returnDateInput.id"
                        :name="returnDateInput.name"
                        :min="tomorrowAsString"
                        :required="returnDateInput.required"
                        :value="returnDateInput.value"
                        @input-changed-value="handleChangedInputValue"
                    />
                </div>
                <div class="p-2">
                    <form-number-input
                        label="If applying a daily discount, enter amount below"
                        :id="discountInput.id"
                        :name="discountInput.name"
                        :min="discountInput.minimum"
                        :required="discountInput.required"
                        :value="discountInput.value"
                        @input-changed-value="handleChangedInputValue"
                    />
                </div>
                <div class="p-2">
                    <button
                        type="submit"
                        class="btn btn-primary"
                    >
                        Rent Tool Now
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import FormSelect from '../components/FormSelect.vue';
    import FormDateInput from '../components/FormDateInput.vue';
    import FormNumberInput from '../components/FormNumberInput.vue';

    const TOOL_SELECT_ID = 'select-tool';
    const CHECKOUT_DATE_ID = 'input-checkout-date';
    const RETURN_DATE_ID = 'input-return-date';
    const DISCOUNT_ID = 'input-discount-amount';

    export default {
        components: {
            'form-select': FormSelect,
            'form-date-input': FormDateInput,
            'form-number-input': FormNumberInput,
        },
        data() {
            return {
                toolSelect: {
                    required: true,
                    id: TOOL_SELECT_ID,
                    name: TOOL_SELECT_ID,
                    value: '',
                    placeholder: 'Please select one of the following tools',
                    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
                },
                checkoutDateInput: {
                    required: true,
                    id: CHECKOUT_DATE_ID,
                    name: CHECKOUT_DATE_ID,
                    value: '',
                },
                returnDateInput: {
                    required: true,
                    id: RETURN_DATE_ID,
                    name: RETURN_DATE_ID,
                    value: '',
                },
                discountInput: {
                    required: false,
                    id: DISCOUNT_ID,
                    name: DISCOUNT_ID,
                    minimum: 0,
                    value: 0,
                },
            }
        },
        computed: {
            today() {
                return new Date();
            },
            tomorrow() {
                const today = this.today;
                return new Date(today.setDate(today.getDate() + 1));
            },
            todayAsString() {
                const date = this.today;
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            },
            tomorrowAsString() {
                const date = this.tomorrow;
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            },
        },
        methods: {
            submitRental() {
                console.log('toolSelect.value', this.toolSelect.value);
                console.log('checkoutDateInput.value', this.checkoutDateInput.value);
                console.log('returnDateInput.value', this.returnDateInput.value);
                console.log('discountInput.value', this.discountInput.value);
            },
            handleChangedInputValue(name, newValue) {
                switch(name) {
                    case CHECKOUT_DATE_ID:
                        this.checkoutDateInput.value = newValue;
                        break;
                    case RETURN_DATE_ID:
                        this.returnDateInput.value = newValue;
                        break;
                    case DISCOUNT_ID:
                        this.discountInput.value = newValue;
                        break;
                    case TOOL_SELECT_ID:
                        this.toolSelect.value = newValue;
                        break;
                    default:
                        // No more possible inputs; do nothing
                }
            },
        },
    };
</script>
