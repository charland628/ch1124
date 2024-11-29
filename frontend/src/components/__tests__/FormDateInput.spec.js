import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import sinon from 'sinon'
import FormDateInput from '../FormDateInput.vue';

describe('FormDateInput', () => {
    const MINIMUM_PROPS = {
        id: 'my-input',
        name: 'my-input',
    };
    const ALL_PROPS = {
        id: 'my-input',
        name: 'my-input',
        label: 'Enter a date',
        required: true,
        min: '2025-01-15',
        warning: 'This is a warning',
        warningDetail: 'Here are more warning details',
        value: '2025-03-14',
    };

    it('renders properly with minimal properties', () => {
        const wrapper = mount(FormDateInput, { props: MINIMUM_PROPS });

        const props = wrapper.getComponent(FormDateInput).props();
        expect(props.id).toBe('my-input');
        expect(props.name).toBe('my-input');
        expect(props.label).toBe('');
        expect(props.required).toBe(false);
        expect(props.min).toBe('');
        expect(props.warning).toBe('');
        expect(props.warningDetail).toBe('');
        expect(props.value).toBe('');

        const label = wrapper.find('label');
        expect(label.attributes().for).toBe('my-input');
        expect(label.classes().length).toBe(1);
        expect(label.classes()[0]).toBe('form-label');

        const input = wrapper.find('input');
        const inputAttrs = input.attributes();
        expect(inputAttrs.type).toBe('date');
        expect(inputAttrs.id).toBe('my-input');
        expect(inputAttrs.name).toBe('my-input');
        expect(inputAttrs.min).toBe('');
        expect(input.classes().length).toBe(1);
        expect(input.classes()[0]).toBe('form-control');
        expect(input.element.value).toBe('');
        expect(input.element.required).toBe(false);

        const feedback = wrapper.find('div.invalid-feedback');
        expect(feedback.exists()).toBe(true);
        const warning = wrapper.find('div.invalid-feedback span');
        expect(warning.exists()).toBe(false);
        const extraWarning = wrapper.find('div.invalid-feedback span span');
        expect(extraWarning.exists()).toBe(false);
    });

    it('renders properly with all properties', () => {
        const wrapper = mount(FormDateInput, { props: ALL_PROPS });

        const props = wrapper.getComponent(FormDateInput).props();
        expect(props.id).toBe('my-input');
        expect(props.name).toBe('my-input');
        expect(props.label).toBe('Enter a date');
        expect(props.required).toBe(true);
        expect(props.min).toBe('2025-01-15');
        expect(props.warning).toBe('This is a warning');
        expect(props.warningDetail).toBe('Here are more warning details');
        expect(props.value).toBe('2025-03-14');

        const label = wrapper.find('label');
        expect(label.attributes().for).toBe('my-input');
        expect(label.classes().length).toBe(1);
        expect(label.classes()[0]).toBe('form-label');
        expect(label.text()).toContain('Enter a date:');

        const input = wrapper.find('input');
        const inputAttrs = input.attributes();
        expect(inputAttrs.type).toBe('date');
        expect(inputAttrs.id).toBe('my-input');
        expect(inputAttrs.name).toBe('my-input');
        expect(inputAttrs.min).toBe('2025-01-15');
        expect(input.classes().length).toBe(1);
        expect(input.classes()[0]).toBe('form-control');
        expect(input.element.value).toBe('2025-03-14');
        expect(input.element.required).toBe(true);

        const feedback = wrapper.find('div.invalid-feedback');
        expect(feedback.exists()).toBe(true);
        const warning = wrapper.find('div.invalid-feedback span');
        expect(warning.text()).toContain('This is a warning');
        const extraWarning = wrapper.find('div.invalid-feedback span span');
        expect(extraWarning.text()).toBe('Here are more warning details');
    });

    it('input updates value and triggers change events when changed', async () => {
        const changeHandler = sinon.stub();
        const props = {...ALL_PROPS, onchange: changeHandler};
        const wrapper = mount(FormDateInput, { props });

        const input = wrapper.find('input');
        await input.setValue('2025-03-21');
        const emits = wrapper.emitted()['input-changed-value'][0];
        expect(emits[0]).toBe('my-input');
        expect(emits[1]).toBe('2025-03-21');
        expect(changeHandler.called).toBe(true);
        expect(wrapper.getComponent(FormDateInput).vm.inputValue).toBe('2025-03-21');
    });
});
