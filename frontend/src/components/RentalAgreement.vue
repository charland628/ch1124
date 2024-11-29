<template>
    <div class="row pt-1">
        <div class="col-sm-12">
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title">Rental Agreement</h4>
                </div>

                <div class="card-body card-text">
                    <table class="table table-dark table-hover">
                        <tbody>
                            <tr>
                                <td>Tool Code</td>
                                <td>{{ toolCode }}</td>
                            </tr>
                            <tr>
                                <td>Tool Type</td>
                                <td>{{ toolType }}</td>
                            </tr>
                            <tr>
                                <td>Tool Brand</td>
                                <td>{{ toolBrand }}</td>
                            </tr>
                            <tr>
                                <td>Checkout Date</td>
                                <td>{{ checkoutDateFormatted }}</td>
                            </tr>
                            <tr>
                                <td>Return Date</td>
                                <td>{{ returnDateFormatted }}</td>
                            </tr>
                            <tr>
                                <td>Daily Rental Charge</td>
                                <td>{{ dailyChargeFormatted }}</td>
                            </tr>
                            <tr>
                                <td>Chargeable Days</td>
                                <td>{{ chargeableDays }}</td>
                            </tr>
                            <tr>
                                <td>Pre-Discount Amount</td>
                                <td>{{ subTotalFormatted }}</td>
                            </tr>
                            <tr>
                                <td>Discount Percent</td>
                                <td>{{ discountPercent }}%</td>
                            </tr>
                            <tr>
                                <td>Discount amount</td>
                                <td>{{ discountAmountFormatted }}</td>
                            </tr>
                            <tr>
                                <td>Final amount</td>
                                <td>{{ totalAmountFormatted }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="card-footer text-center">
                    <button
                        type="button"
                        class="btn btn-primary"
                        v-on:click="submitRental"
                    >
                        Submit Rental Agreement
                    </button>
                    <RouterLink class="btn btn-warning" to="/">Start New Rental</RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import { RouterLink } from 'vue-router';
    import business from 'moment-business';
    import holidayService from '../services/holidays.js';
    import apiService from '../services/apis.js';

    export default {
        data() {
            return {
                usDollar: new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }),
            };
        },

        props: {
            info: {
                type: Object,
                required: true,
            },
        },

        computed: {
            toolCode() {
                return this.info.toolSelected;
            },

            selectedToolInfo() {
                return this.tools.data.find(tool => tool.code === this.toolCode) || {};
            },

            toolType() {
                return this.selectedToolInfo.type || '';
            },

            toolBrand() {
                return this.selectedToolInfo.brand || '';
            },

            checkoutDate() {
                return moment(this.info.checkoutDate);
            },

            checkoutDateFormatted() {
                return this.checkoutDate.format('MM/DD/YY');
            },

            returnDate() {
                return moment(this.info.returnDate);
            },

            returnDateFormatted() {
                return this.returnDate.format('MM/DD/YY');
            },

            selectedToolPricing() {
                return this.toolCharges.data.find(tool => tool.type === this.toolType) || {};
            },

            chargeOnHoliday() {
                return this.selectedToolPricing.chargeOnHoliday;
            },

            chargeOnWeekday() {
                return this.selectedToolPricing.chargeOnWeekday;
            },

            chargeOnWeekend() {
                return this.selectedToolPricing.chargeOnWeekend;
            },

            dailyCharge() {
                return this.selectedToolPricing.dailyCharge;
            },

            dailyChargeFormatted() {
                return this.usDollar.format(this.dailyCharge);
            },

            holidayYears() {
                const years = [];
                for (let year = this.checkoutDate.year(); year <= this.returnDate.year(); year++) {
                    years.push(year);
                }
                return years;
            },

            holidays() {
                return holidayService.getHolidays(this.holidayYears);
            },

            rentalSchedule() {
                const dateRange = [];
                let currentDate = this.checkoutDate;
                const endDate = this.returnDate;

                while (currentDate.isBefore(endDate)) {
                    const isWeekday = business.isWeekDay(currentDate);
                    const isWeekend = !isWeekday;
                    const isHoliday = this.holidays.some(day => day.isSame(currentDate));
                    let isChargeable;

                    if (isHoliday) {
                        isChargeable = this.chargeOnHoliday;
                    } else if (isWeekend) {
                        isChargeable = this.chargeOnWeekend;
                    } else {
                        isChargeable = this.chargeOnWeekday;
                    }

                    const rentalDay = {
                        date: currentDate.format('MM/DD/YY'),
                        isHoliday,
                        isWeekday,
                        isWeekend,
                        isChargeable,
                    };
                    dateRange.push(rentalDay);
                    currentDate = currentDate.add(1, 'days');
                }
                return dateRange;
            },

            chargeableDays() {
                return this.rentalSchedule.filter(day => day.isChargeable).length;
            },

            subTotal() {
                return Math.round(100 * this.dailyCharge * this.chargeableDays) / 100;
            },

            subTotalFormatted() {
                return this.usDollar.format(this.subTotal);
            },

            discountPercent() {
                return this.info.discount;
            },

            discountAmount() {
                return Math.round(this.subTotal * this.info.discount) / 100;
            },

            discountAmountFormatted() {
                return this.usDollar.format(this.discountAmount);
            },

            totalAmount() {
                return this.subTotal - this.discountAmount;
            },

            totalAmountFormatted() {
                return this.usDollar.format(this.totalAmount);
            },
        },

        inject: [
            'tools',
            'toolCharges',
        ],

        methods: {
            async submitRental() {
                const payload = {
                    toolCode: this.toolCode,
                    checkoutDate: this.checkoutDateFormatted,
                    returnDate: this.returnDateFormatted,
                    discountPercent: this.discountPercent,
                    chargeableDays: this.chargeableDays,
                    dailyCharge: this.dailyCharge,
                    prediscountAmount: this.subTotal,
                    discountAmount: this.discountAmount,
                    finalAmount: this.totalAmount,
                };
                const transmitted = await apiService.postToolRentalAgreement(payload);

                if (transmitted.success) {
                    this.$router.push('/');
                } else {
                    alert('There was an error submitting your request. Please try again.')
                }
            },
        },
    };
</script>
