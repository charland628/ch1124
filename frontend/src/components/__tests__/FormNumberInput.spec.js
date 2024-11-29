import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import sinon from 'sinon'
import FormNumberInput from '../FormNumberInput.vue';

describe('FormNumberInput', () => {
    const MINIMUM_PROPS = {
        id: 'my-input',
        name: 'my-input',
    };
    const ALL_PROPS = {
        id: 'my-input',
        name: 'my-input',
        label: 'Enter a number',
        required: true,
        min: 0,
        max: 10,
        warning: 'This is a warning',
        warningDetail: 'Here are more warning details',
        value: 5,
    };

    it('renders properly with minimal properties', () => {
        const wrapper = mount(FormNumberInput, { props: MINIMUM_PROPS });

        const props = wrapper.getComponent(FormNumberInput).props();
        expect(props.id).toBe('my-input');
        expect(props.name).toBe('my-input');
        expect(props.label).toBe('');
        expect(props.required).toBe(false);
        expect(props.min).toBe(undefined);
        expect(props.max).toBe(undefined);
        expect(props.warning).toBe('');
        expect(props.warningDetail).toBe('');
        expect(props.value).toBe(0);

        const label = wrapper.find('label');
        expect(label.attributes().for).toBe('my-input');
        expect(label.classes().length).toBe(1);
        expect(label.classes()[0]).toBe('form-label');

        const input = wrapper.find('input');
        const inputAttrs = input.attributes();
        expect(inputAttrs.type).toBe('number');
        expect(inputAttrs.id).toBe('my-input');
        expect(inputAttrs.name).toBe('my-input');
        expect(inputAttrs.min).toBe(undefined);
        expect(inputAttrs.max).toBe(undefined);
        expect(inputAttrs.step).toBe('1');
        expect(input.classes().length).toBe(1);
        expect(input.classes()[0]).toBe('form-control');
        expect(input.element.value).toBe('0');
        expect(input.element.required).toBe(false);

        const feedback = wrapper.find('div.invalid-feedback');
        expect(feedback.exists()).toBe(true);
        const warning = wrapper.find('div.invalid-feedback span');
        expect(warning.exists()).toBe(false);
        const extraWarning = wrapper.find('div.invalid-feedback span span');
        expect(extraWarning.exists()).toBe(false);
    });

    it('renders properly with all properties', () => {
        const wrapper = mount(FormNumberInput, { props: ALL_PROPS });

        const props = wrapper.getComponent(FormNumberInput).props();
        expect(props.id).toBe('my-input');
        expect(props.name).toBe('my-input');
        expect(props.label).toBe('Enter a number');
        expect(props.required).toBe(true);
        expect(props.min).toBe(0);
        expect(props.max).toBe(10);
        expect(props.warning).toBe('This is a warning');
        expect(props.warningDetail).toBe('Here are more warning details');
        expect(props.value).toBe(5);

        const label = wrapper.find('label');
        expect(label.attributes().for).toBe('my-input');
        expect(label.classes().length).toBe(1);
        expect(label.classes()[0]).toBe('form-label');
        expect(label.text()).toContain('Enter a number:');

        const input = wrapper.find('input');
        const inputAttrs = input.attributes();
        expect(inputAttrs.type).toBe('number');
        expect(inputAttrs.id).toBe('my-input');
        expect(inputAttrs.name).toBe('my-input');
        expect(inputAttrs.min).toBe('0');
        expect(inputAttrs.max).toBe('10');
        expect(inputAttrs.step).toBe('1');
        expect(input.classes().length).toBe(1);
        expect(input.classes()[0]).toBe('form-control');
        expect(input.element.value).toBe('5');
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
        const wrapper = mount(FormNumberInput, { props });

        const input = wrapper.find('input');
        await input.setValue('7');
        const emits = wrapper.emitted()['input-changed-value'][0];
        expect(emits[0]).toBe('my-input');
        expect(emits[1]).toBe(7);
        expect(changeHandler.called).toBe(true);
        expect(wrapper.getComponent(FormNumberInput).vm.inputValue).toBe(7);
    });
});
