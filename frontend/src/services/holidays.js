import moment from 'moment';

export default {
    DAYS: {
        SUN: 0,
        MON: 1,
        TUE: 2,
        WED: 3,
        THU: 4,
        FRI: 5,
        SAT: 6,
    },

    DAYS_IN_WEEK: 7,

    getHolidays(years) {
        const allHolidays = [];

        years.forEach((year => {
            allHolidays.push(this.getDateFor4thOfJuly(year));
            allHolidays.push(this.getDateForLaborDay(year));
        }));

        return allHolidays;
    },

    getDateFor4thOfJuly(year) {
        let holiday = moment(`${year}-07-04`);

        if (holiday.weekday() === this.DAYS.SUN) {
            holiday.add(1, 'days');
        } else if (holiday.weekday() === this.DAYS.SAT) {
            holiday.subtract(1, 'days');
        }

        return holiday;
    },

    getDateForLaborDay(year) {
        let holiday = moment(`${year}-09-01`).isoWeekday(8); // 2nd week

        if (holiday.date() > this.DAYS_IN_WEEK) {
            holiday = holiday.isoWeekday(-6);
        }

        return holiday;
    },

    getHolidayYearsFromDateRange(startDate, endDate) {
        const years = [];
        const startYear = startDate.year();
        const endYear = endDate.year();
        if (startYear <= endYear) {
            for (let year = startYear; year <= endYear; year++) {
                years.push(year);
            }
        }
        return years;
    },
};
