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
                        :options="toolSelectOptions"
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
                        :min="firstAvailableReturnDateAsString"
                        :required="returnDateInput.required"
                        :value="returnDateInput.value"
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
                        @input-changed-value="handleChangedInputValue"
                    />
                </div>
                <div class="p-2 text-center">
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

        inject: ['tools', 'toolCharges'],

        data() {
            return {
                usDollar: new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }),

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
        },

        methods: {
            submitRental() {
                console.log('toolSelectOptions', this.toolSelectOptions);
                console.log('toolSelect.value', this.toolSelect.value);
                console.log('checkoutDateInput.value', this.checkoutDateInput.value);
                console.log('returnDateInput.value', this.returnDateInput.value);
                console.log('discountInput.value', this.discountInput.value);
                console.log('tools', this.tools.data);
                console.log('toolCharges', this.toolCharges.data);
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
