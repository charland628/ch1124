<template>
    <div class="row pt-1">
        <div class="col-sm-12 text-bg-secondary">
            Rental Agreement Component
        </div>
    </div>
</template>

<script>
    import holidaysGetter from '../services/holidaysGetter.js';

    export default {
        data() {
            return {
                holidays: [],
            };
        },

        props: {
            info: {
                type: Object,
                required: true,
            },
        },

        inject: [
            'tools',
            'toolCharges',
        ],

        created() {
            console.log('RENTAL AGREEMENT COMPONENT CREATED');

            this.holidays = holidaysGetter.getHolidays([2024]);
            this.holidays.forEach((h) => {
                console.log('holidays', h.format('YYYY-MM-DD'));
            });

            this.tools.data.forEach((t) => {
                console.log(t);
            });
            this.toolCharges.data.forEach((tc) => {
                console.log(tc);
            });

            console.log('RENTAL INFO', this.info);
        },
    };
</script>
