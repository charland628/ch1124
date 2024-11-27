<template>
    <div
        v-if="allApisFetched"
        class="row pt-1"
    >
        <div class="col-sm-12 text-bg-secondary">
            <form :class="{ 'was-validated': submitClicked }">
                <div class="p-2">
                    <form-select
                        label="Select one of the following tools"
                        :id="toolSelect.id"
                        :name="toolSelect.name"
                        :required="toolSelect.required"
                        :options="toolSelectOptions"
                        :placeholder="toolSelect.placeholder"
                        :value="toolSelect.value"
                        warning="Please select a tool."
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
                        warning="Please enter a valid date."
                        @input-changed-value="handleChangedInputValue"
                    />
                </div>
                <div class="p-2">
                    <form-date-input
                        label="Please choose a return date (at least one day in future)"
                        :id="returnDateInput.id"
                        :name="returnDateInput.name"
                        :min="firstAvailableReturnDateAsString"
                        :required="returnDateInput.required"
                        :value="returnDateInput.value"
                        warning="Please enter a valid date."
                        warning-detail="Return date must be at least one day after checkout date."
                        @input-changed-value="handleChangedInputValue"
                    />
                </div>
                <div class="p-2">
                    <form-number-input
                        label="If applying a daily discount, enter percentage below"
                        :id="discountInput.id"
                        :name="discountInput.name"
                        :min="discountInput.minimum"
                        :max="discountInput.maximum"
                        :required="discountInput.required"
                        :value="discountInput.value"
                        warning="Discount percentage must be between 0 and 100."
                        @input-changed-value="handleChangedInputValue"
                    />
                </div>
                <div class="p-2 text-center">
                    <button
                        type="click"
                        class="btn btn-primary"
                        v-on:click="submitRental"
                    >
                        Rent Tool Now
                    </button>
                </div>
            </form>
        </div>
    </div>
    <div
        v-else
        class="text-bg-danger"
    >
        There was an API error and we were not able to load the form. Try reloading the page.
    </div>
</template>

<script>
    import moment from 'moment';
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

        inject: [
            'tools',
            'toolCharges',
            'apisFetched',
        ],

        data() {
            return {
                usDollar: new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }),

                submitClicked: false,

                toolSelect: {
                    required: true,
                    id: TOOL_SELECT_ID,
                    name: TOOL_SELECT_ID,
                    value: '',
                    placeholder: 'Please select one of the following tools',
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
                    maximum: 100,
                    value: 0,
                },
            };
        },

        computed: {
            allApisFetched() {
                return this.apisFetched.tools && this.apisFetched.toolCharges;
            },

            today() {
                return moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
            },

            tomorrow() {
                return this.today.add(1, 'days');
            },

            todayAsString() {
                return this.today.format('YYYY-MM-DD');
            },

            firstAvailableReturnDateAsString() {
                let latestDate = this.tomorrow;
                if (this.checkoutDateInput.value.length > 0) {
                    const checkoutDate = moment(this.checkoutDateInput.value);
                    latestDate = !checkoutDate.isBefore(this.tomorrow) ? checkoutDate.add(1, 'days') : this.tomorrow;
                }
                return latestDate.format('YYYY-MM-DD');
            },

            toolSelectOptions() {
                const options = [];
                this.tools.data.forEach((tool) => {
                    const price = this.toolCharges.data.find(t => t.type === tool.type).dailyCharge;
                    const option = {
                        desc: `${tool.brand} ${tool.type}: Up to ${this.usDollar.format(price)} per day`,
                        code: tool.code,
                    };
                    options.push(option);
                });
                return options;
            },

            formIsValid() {
                let isValid = false;
                const checkoutDateValid = this.checkoutDateInput.value.length > 0;
                const returnDateValid = this.returnDateInput.value.length > 0;

                if (checkoutDateValid && returnDateValid) {
                    const checkoutDate = moment(this.checkoutDateInput.value);
                    const returnDate = moment(this.returnDateInput.value);
                    const dateRangeValid = checkoutDate.isBefore(returnDate);
                    const discountValid = 0 <= this.discountInput.value && this.discountInput.value <= 100;
                    const toolValid = this.toolSelect.value.length > 0;
                    isValid = discountValid && toolValid && dateRangeValid;
                }

                return isValid;
            },
        },

        emits: ['rental-form-submitted'],

        methods: {
            submitRental(e) {
                this.submitClicked = true;
                if (this.formIsValid) {
                    this.$emit('rental-form-submitted', {
                        toolSelected: this.toolSelect.value,
                        checkoutDate: this.checkoutDateInput.value,
                        returnDate: this.returnDateInput.value,
                        discount: this.discountInput.value,
                    });
                }
                e.preventDefault();
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
