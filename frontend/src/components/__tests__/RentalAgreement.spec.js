import { describe, it, expect, vi } from 'vitest';

import { mount } from '@vue/test-utils';
import router from "@/router";
import RentalAgreement from '../RentalAgreement.vue';
import sinon from 'sinon'
import apiService from '../../services/apis.js';
import { tools, toolCharges } from './data/unitTestData.js';

describe('RentalAgreement', () => {
    const PROVIDE_INJECTION = {
        provide: { tools, toolCharges },
        mocks: {
            $route: '/',
            $router: {
                push: () => {},
            },
        },
        plugins: [router],
    };
    const PROPS_WITH_INFO = {
        info: {
            toolSelected: 'Code4',
            checkoutDate: '2025-03-14',
            returnDate: '2026-03-14',
            discount: 10,
        },
    };

    it('renders the rental agreement details based on the user selection', () => {
        const wrapper = mount(RentalAgreement, {
            props: PROPS_WITH_INFO,
            global: PROVIDE_INJECTION,
        });

        const props = wrapper.getComponent(RentalAgreement).props();
        expect(props.info.toolSelected).toBe('Code4');
        expect(props.info.checkoutDate).toBe('2025-03-14');
        expect(props.info.returnDate).toBe('2026-03-14');
        expect(props.info.discount).toBe(10);

        expect(wrapper.vm.toolCode).toBe('Code4');
        expect(wrapper.vm.selectedToolInfo.brand).toBe('Brand D');
        expect(wrapper.vm.selectedToolInfo.code).toBe('Code4');
        expect(wrapper.vm.selectedToolInfo.type).toBe('type3');
        expect(wrapper.vm.toolType).toBe('type3');
        expect(wrapper.vm.toolBrand).toBe('Brand D');
        expect(wrapper.vm.checkoutDateFormatted).toBe('03/14/25');
        expect(wrapper.vm.returnDateFormatted).toBe('03/14/26');
        expect(wrapper.vm.selectedToolPricing.chargeOnHoliday).toBe(false);
        expect(wrapper.vm.selectedToolPricing.chargeOnWeekday).toBe(true);
        expect(wrapper.vm.selectedToolPricing.chargeOnWeekend).toBe(false);
        expect(wrapper.vm.selectedToolPricing.dailyCharge).toBe(2.99);
        expect(wrapper.vm.selectedToolPricing.type).toBe('type3');
        expect(wrapper.vm.chargeOnHoliday).toBe(false);
        expect(wrapper.vm.chargeOnWeekday).toBe(true);
        expect(wrapper.vm.chargeOnWeekend).toBe(false);
        expect(wrapper.vm.dailyCharge).toBe(2.99);
        expect(wrapper.vm.dailyChargeFormatted).toBe('$2.99');
        expect(wrapper.vm.holidayYears.length).toBe(2);
        expect(wrapper.vm.holidayYears[0]).toBe(2025);
        expect(wrapper.vm.holidayYears[1]).toBe(2026);
        expect(wrapper.vm.holidays.length).toBe(4);
        expect(wrapper.vm.holidays[0].format('MM/DD/YY')).toBe('07/04/25');
        expect(wrapper.vm.holidays[1].format('MM/DD/YY')).toBe('09/01/25');
        expect(wrapper.vm.holidays[2].format('MM/DD/YY')).toBe('07/03/26');
        expect(wrapper.vm.holidays[3].format('MM/DD/YY')).toBe('09/07/26');
        expect(wrapper.vm.rentalSchedule.length).toBe(365);
        expect(wrapper.vm.chargeableDays).toBe(259);
        expect(wrapper.vm.subTotal).toBe(774.41);
        expect(wrapper.vm.subTotalFormatted).toBe('$774.41');
        expect(wrapper.vm.discountPercent).toBe(10);
        expect(wrapper.vm.discountAmount).toBe(77.44);
        expect(wrapper.vm.discountAmountFormatted).toBe('$77.44');
        expect(wrapper.vm.totalAmount).toBe(696.97);
        expect(wrapper.vm.totalAmountFormatted).toBe('$696.97');
        expect(wrapper.find('#rental-tool-code').text()).toBe('Code4');
        expect(wrapper.find('#rental-tool-type').text()).toBe('type3');
        expect(wrapper.find('#rental-tool-brand').text()).toBe('Brand D');
        expect(wrapper.find('#rental-checkout-date').text()).toBe('03/14/25');
        expect(wrapper.find('#rental-return-date').text()).toBe('03/14/26');
        expect(wrapper.find('#rental-daily-charge').text()).toBe('$2.99');
        expect(wrapper.find('#rental-chargeable-days').text()).toBe('259');
        expect(wrapper.find('#rental-prediscount-amount').text()).toBe('$774.41');
        expect(wrapper.find('#rental-discount-percent').text()).toBe('10%');
        expect(wrapper.find('#rental-discount-amount').text()).toBe('$77.44');
        expect(wrapper.find('#rental-final-amount').text()).toBe('$696.97');
    });

    it('renders the rental agreement formatting large amounts correctly', () => {
        const wrapper = mount(RentalAgreement, {
            props: {
                info: {
                    toolSelected: 'Code4',
                    checkoutDate: '2025-03-14',
                    returnDate: '2046-03-14',
                    discount: 10,
                },
            },
            global: PROVIDE_INJECTION,
        });

        expect(wrapper.vm.totalAmountFormatted).toBe('$14,628.28');
        expect(wrapper.find('#rental-final-amount').text()).toBe('$14,628.28');
    });

    it('clicking submit button when form is valid emits rental-form-submitted event', async () => {
        const submitHandler = sinon.stub();
        const PROPERTIES_WITH_HANDLER = { ...PROPS_WITH_INFO, onclick: submitHandler };
        const wrapper = mount(RentalAgreement, {
            props: PROPERTIES_WITH_HANDLER,
            global: PROVIDE_INJECTION,
        });
        vi.spyOn(router, 'push');
        const mockedApiCall = vi.spyOn(apiService, 'postToolRentalAgreement').mockReturnValue({ success: true });

        const button = wrapper.find('button#rental-agreement-btn');
        await button.trigger('click');

        expect(mockedApiCall).toHaveBeenCalledTimes(1);
        expect(mockedApiCall).toHaveBeenCalledWith({
            chargeableDays: 259,
            checkoutDate: '03/14/25',
            dailyCharge: 2.99,
            discountAmount: 77.44,
            discountPercent: 10,
            finalAmount: 696.97,
            prediscountAmount: 774.41,
            returnDate: '03/14/26',
            toolCode: 'Code4',
        });
    });
});
