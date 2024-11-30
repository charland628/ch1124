import { describe, it, expect } from 'vitest';

import moment from 'moment';
import holidayService from '../holidays.js';

describe('holidayService', () => {
    const startDate = moment('2024-03-14');

    describe('getHolidayYearsFromDateRange()', () => {
        it('should return single year when start date and end date are the same year', () => {
            const endDate = moment('2024-11-14');
            const years = holidayService.getHolidayYearsFromDateRange(startDate, endDate);
            expect(years.length).toBe(1);
            expect(years[0]).toBe(2024);
        });

        it('should return empty array when start year is after end year', () => {
            const endDate = moment('2023-01-14');
            const years = holidayService.getHolidayYearsFromDateRange(startDate, endDate);
            expect(years.length).toBe(0);
        });

        it('should return array of years when start date is years before end date', () => {
            const endDate = moment('2027-11-14');
            const years = holidayService.getHolidayYearsFromDateRange(startDate, endDate);
            expect(years.length).toBe(4);
            expect(years[0]).toBe(2024);
            expect(years[1]).toBe(2025);
            expect(years[2]).toBe(2026);
            expect(years[3]).toBe(2027);
        });
    });

    describe('getHolidays() with (getDateFor4thOfJuly() and getDateForLaborDay())', () => {
        it('should return 0 holidays when no years provided', () => {
            const holidayList = holidayService.getHolidays([]);
            expect(holidayList.length).toBe(0);
        });

        it('should return 2 holidays (July 4th and Labor Day) for a single year', () => {
            const holidayList = holidayService.getHolidays([ 2024 ]);
            expect(holidayList.length).toBe(2);
            expect(holidayList[0].format('YYYY-MM-DD')).toBe('2024-07-04');
            expect(holidayList[1].format('YYYY-MM-DD')).toBe('2024-09-02');
        });

        it('should return 6 holidays (July 4th and Labor Day) during 3 years', () => {
            const holidayList = holidayService.getHolidays([ 2025, 2026, 2027 ]);
            expect(holidayList.length).toBe(6);
            expect(holidayList[0].format('YYYY-MM-DD')).toBe('2025-07-04');
            expect(holidayList[1].format('YYYY-MM-DD')).toBe('2025-09-01');
            expect(holidayList[2].format('YYYY-MM-DD')).toBe('2026-07-03');
            expect(holidayList[3].format('YYYY-MM-DD')).toBe('2026-09-07');
            expect(holidayList[4].format('YYYY-MM-DD')).toBe('2027-07-05');
            expect(holidayList[5].format('YYYY-MM-DD')).toBe('2027-09-06');
        });
    });
});
