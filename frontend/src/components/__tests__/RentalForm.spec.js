import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import sinon from 'sinon'
import moment from 'moment';
import RentalForm from '../RentalForm.vue';
import { tools, toolCharges } from './data/unitTestData.js';
import FormSelect from '../FormSelect.vue';
import FormDateInput from '../FormDateInput.vue';
import FormNumberInput from '../FormNumberInput.vue';

describe('RentalForm', () => {
    const PROVIDE_BEFORE_API_LOAD = {
        provide: {
            tools: { data: null },
            toolCharges: { data: null },
            apisFetched: {
                tools: false,
                toolCharges: false,
            },
        },
    };
    const PROVIDE_AFTER_API_LOAD = {
        provide: {
            tools,
            toolCharges,
            apisFetched: {
                tools: true,
                toolCharges: true,
            },
        },
    };
    const TODAY = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const TOMORROW = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).add(1, 'days');

    it('renders a warning when APIs not loaded', () => {
        const wrapper = mount(RentalForm, { global: PROVIDE_BEFORE_API_LOAD });
        expect(wrapper.vm.allApisFetched).toBe(false);
        const div = wrapper.find('div#rental-form-error');
        expect(div.classes().length).toBe(1);
        expect(div.classes()[0]).toBe('text-bg-danger');
        expect(div.text()).toBe('There was an API error and we were not able to load the form. Try reloading the page.');
    });

    it('renders Rental Form after APIs loaded', () => {
        const wrapper = mount(RentalForm, { global: PROVIDE_AFTER_API_LOAD });
        expect(wrapper.vm.allApisFetched).toBe(true);

        const div = wrapper.find('div#rental-form');
        expect(div.exists()).toBe(true);

        const select = wrapper.findComponent(FormSelect);
        expect(select.vm.id).toBe('select-tool');
        expect(select.vm.name).toBe('select-tool');
        expect(select.vm.label).toBe('Select one of the following tools');
        expect(select.vm.required).toBe(true);
        expect(select.vm.options.length).toBe(4);
        expect(select.vm.options[0].desc).toBe('Brand A type2: Up to $1.49 per day');
        expect(select.vm.options[0].code).toBe('Code1');
        expect(select.vm.options[1].desc).toBe('Brand B type1: Up to $1.99 per day');
        expect(select.vm.options[1].code).toBe('Code2');
        expect(select.vm.options[2].desc).toBe('Brand C type3: Up to $2.99 per day');
        expect(select.vm.options[2].code).toBe('Code3');
        expect(select.vm.options[3].desc).toBe('Brand D type3: Up to $2.99 per day');
        expect(select.vm.options[3].code).toBe('Code4');
        expect(select.vm.placeholder).toBe('Please select one of the following tools');
        expect(select.vm.warning).toBe('Please select a tool.');
        expect(select.vm.warningDetail).toBe('');
        expect(select.vm.value).toBe('');

        const dateInputs = wrapper.findAllComponents(FormDateInput);
        const checkoutDate = dateInputs[0];
        expect(checkoutDate.vm.id).toBe('input-checkout-date');
        expect(checkoutDate.vm.name).toBe('input-checkout-date');
        expect(checkoutDate.vm.label).toBe('Please choose a checkout date');
        expect(checkoutDate.vm.required).toBe(true);
        expect(checkoutDate.vm.min).toBe(TODAY.format('YYYY-MM-DD'));
        expect(checkoutDate.vm.warning).toBe('Please enter a valid date.');
        expect(checkoutDate.vm.warningDetail).toBe('');
        expect(checkoutDate.vm.value).toBe('');

        const returnDate = dateInputs[1];
        expect(returnDate.vm.id).toBe('input-return-date');
        expect(returnDate.vm.name).toBe('input-return-date');
        expect(returnDate.vm.label).toBe('Please choose a return date (at least one day in future)');
        expect(returnDate.vm.required).toBe(true);
        expect(returnDate.vm.min).toBe(TOMORROW.format('YYYY-MM-DD'));
        expect(returnDate.vm.warning).toBe('Please enter a valid date.');
        expect(returnDate.vm.warningDetail).toBe('Return date must be at least one day after checkout date.');
        expect(returnDate.vm.value).toBe('');

        const discount = wrapper.findComponent(FormNumberInput);
        expect(discount.vm.id).toBe('input-discount-amount');
        expect(discount.vm.name).toBe('input-discount-amount');
        expect(discount.vm.label).toBe('If applying a daily discount, enter percentage below');
        expect(discount.vm.required).toBe(false);
        expect(discount.vm.min).toBe(0);
        expect(discount.vm.max).toBe(100);
        expect(discount.vm.warning).toBe('Discount percentage must be a whole number between 0 and 100.');
        expect(discount.vm.warningDetail).toBe('');
        expect(discount.vm.value).toBe(0);
    });

    it('date functions get correct dates and display correctly', async () => {
        const wrapper = mount(RentalForm, { global: PROVIDE_AFTER_API_LOAD });
        expect(wrapper.vm.today.isSame(TODAY)).toBe(true);
        expect(wrapper.vm.tomorrow.isSame(TOMORROW)).toBe(true);
        expect(wrapper.vm.todayAsString).toBe(TODAY.format('YYYY-MM-DD'));
        expect(wrapper.vm.firstAvailableReturnDateAsString).toBe(TOMORROW.format('YYYY-MM-DD'));
        await wrapper.setData({ checkoutDateInput: { value: '2099-03-14'} });
        expect(wrapper.vm.firstAvailableReturnDateAsString).toBe('2099-03-15');
    });

    it('clicking submit button when form is invalid shows errors', async () => {
        const wrapper = mount(RentalForm, { global: PROVIDE_AFTER_API_LOAD });

        const button = wrapper.find('button#checkout-btn');
        expect(wrapper.vm.submitClicked).toBe(false);
        expect(wrapper.vm.formIsValid).toBe(false);

        await button.trigger('click');
        expect(wrapper.vm.submitClicked).toBe(true);
        expect(wrapper.vm.formIsValid).toBe(false);

        await wrapper.setData({ toolSelect: { value: ''} });
        await wrapper.setData({ checkoutDateInput: { value: '2099-03-14'} });
        await wrapper.setData({ returnDateInput: { value: '2099-03-15'} });
        await wrapper.setData({ discountInput: { value: 10} });
        await button.trigger('click');
        expect(wrapper.vm.formIsValid).toBe(false);

        await wrapper.setData({ toolSelect: { value: 'Code1'} });
        await wrapper.setData({ checkoutDateInput: { value: ''} });
        await wrapper.setData({ returnDateInput: { value: '2099-03-15'} });
        await wrapper.setData({ discountInput: { value: 10} });
        await button.trigger('click');
        expect(wrapper.vm.formIsValid).toBe(false);

        await wrapper.setData({ toolSelect: { value: 'Code1'} });
        await wrapper.setData({ checkoutDateInput: { value: '2099-03-14'} });
        await wrapper.setData({ returnDateInput: { value: ''} });
        await wrapper.setData({ discountInput: { value: 10} });
        await button.trigger('click');
        expect(wrapper.vm.formIsValid).toBe(false);

        await wrapper.setData({ toolSelect: { value: 'Code1'} });
        await wrapper.setData({ checkoutDateInput: { value: '2099-03-14'} });
        await wrapper.setData({ returnDateInput: { value: '2099-03-15'} });
        await wrapper.setData({ discountInput: { value: -5} });
        await button.trigger('click');
        expect(wrapper.vm.formIsValid).toBe(false);

        await wrapper.setData({ toolSelect: { value: 'Code1'} });
        await wrapper.setData({ checkoutDateInput: { value: '2099-03-15'} });
        await wrapper.setData({ returnDateInput: { value: '2099-03-15'} });
        await wrapper.setData({ discountInput: { value: 10} });
        await button.trigger('click');
        expect(wrapper.vm.formIsValid).toBe(false);
    });

    it('clicking submit button when form is valid emits rental-form-submitted event', async () => {
        const submitHandler = sinon.stub();
        const props = { onclick: submitHandler};
        const wrapper = mount(RentalForm, { props, global: PROVIDE_AFTER_API_LOAD });
        const button = wrapper.find('button#checkout-btn');

        await wrapper.setData({ toolSelect: { value: 'Code1'} });
        await wrapper.setData({ checkoutDateInput: { value: '2099-03-10'} });
        await wrapper.setData({ returnDateInput: { value: '2099-03-15'} });
        await wrapper.setData({ discountInput: { value: 10} });
        await button.trigger('click');
        expect(wrapper.vm.formIsValid).toBe(true);

        const emits = wrapper.emitted()['rental-form-submitted'][0][0];
        expect(emits.toolSelected).toBe('Code1');
        expect(emits.checkoutDate).toBe('2099-03-10');
        expect(emits.returnDate).toBe('2099-03-15');
        expect(emits.discount).toBe(10);
        expect(submitHandler.called).toBe(true);
        wrapper.vm.handleChangedInputValue('xxx', 1);
    });

    it('handleChangedInputValue updates correct value', () => {
        const wrapper = mount(RentalForm, { global: PROVIDE_AFTER_API_LOAD });
        expect(wrapper.vm.toolSelect.value).toBe('');
        expect(wrapper.vm.checkoutDateInput.value).toBe('');
        expect(wrapper.vm.returnDateInput.value).toBe('');
        expect(wrapper.vm.discountInput.value).toBe(0);

        wrapper.vm.handleChangedInputValue('bad data should have no effecr', 1);
        expect(wrapper.vm.toolSelect.value).toBe('');
        expect(wrapper.vm.checkoutDateInput.value).toBe('');
        expect(wrapper.vm.returnDateInput.value).toBe('');
        expect(wrapper.vm.discountInput.value).toBe(0);

        wrapper.vm.handleChangedInputValue('input-checkout-date', '2099-03-10');
        expect(wrapper.vm.toolSelect.value).toBe('');
        expect(wrapper.vm.checkoutDateInput.value).toBe('2099-03-10');
        expect(wrapper.vm.returnDateInput.value).toBe('');
        expect(wrapper.vm.discountInput.value).toBe(0);

        wrapper.vm.handleChangedInputValue('input-return-date', '2099-03-15');
        expect(wrapper.vm.toolSelect.value).toBe('');
        expect(wrapper.vm.checkoutDateInput.value).toBe('2099-03-10');
        expect(wrapper.vm.returnDateInput.value).toBe('2099-03-15');
        expect(wrapper.vm.discountInput.value).toBe(0);

        wrapper.vm.handleChangedInputValue('input-discount-amount', 25);
        expect(wrapper.vm.toolSelect.value).toBe('');
        expect(wrapper.vm.checkoutDateInput.value).toBe('2099-03-10');
        expect(wrapper.vm.returnDateInput.value).toBe('2099-03-15');
        expect(wrapper.vm.discountInput.value).toBe(25);

        wrapper.vm.handleChangedInputValue('select-tool', 'Code1');
        expect(wrapper.vm.toolSelect.value).toBe('Code1');
        expect(wrapper.vm.checkoutDateInput.value).toBe('2099-03-10');
        expect(wrapper.vm.returnDateInput.value).toBe('2099-03-15');
        expect(wrapper.vm.discountInput.value).toBe(25);
    });
});
