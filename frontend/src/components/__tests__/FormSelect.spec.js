import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import sinon from 'sinon'
import FormSelect from '../FormSelect.vue';

describe('FormSelect', () => {
    const OPTIONS = [
        {
            code: 'code 1',
            desc: 'description 1',
        },
        {
            code: 'code 2',
            desc: 'description 2',
        },
    ];
    const MINIMUM_PROPS = {
        id: 'my-select',
        name: 'my-select',
        options: OPTIONS,
    };
    const ALL_PROPS = {
        id: 'my-select',
        name: 'my-select',
        options: OPTIONS,
        label: 'Select Something',
        required: true,
        placeholder: 'Some placeholder text',
        warning: 'This is a warning',
        warningDetail: 'Here are more warning details',
        value: '',
    };

    it('renders properly with minimal properties', () => {
        const wrapper = mount(FormSelect, { props: MINIMUM_PROPS });

        const props = wrapper.getComponent(FormSelect).props();
        expect(props.id).toBe('my-select');
        expect(props.name).toBe('my-select');
        expect(props.options.length).toBe(2);
        expect(props.options[0].code).toBe('code 1');
        expect(props.options[0].desc).toBe('description 1');
        expect(props.options[1].code).toBe('code 2');
        expect(props.options[1].desc).toBe('description 2');
        expect(props.label).toBe('');
        expect(props.required).toBe(false);
        expect(props.placeholder).toBe('');
        expect(props.warning).toBe('');
        expect(props.warningDetail).toBe('');
        expect(props.value).toBe('');

        expect(wrapper.getComponent(FormSelect).vm.showPlaceholder).toBe(false);

        const label = wrapper.find('label');
        expect(label.attributes().for).toBe('my-select');
        expect(label.classes().length).toBe(1);
        expect(label.classes()[0]).toBe('form-label');

        const select = wrapper.find('select');
        const selectAttrs = select.attributes();
        expect(selectAttrs.id).toBe('my-select');
        expect(selectAttrs.name).toBe('my-select');
        expect(select.classes().length).toBe(2);
        expect(select.classes()[0]).toBe('form-select');
        expect(select.classes()[1]).toBe('form-control');
        expect(select.element.value).toBe('');
        expect(select.element.required).toBe(false);

        const options = wrapper.findAll('option');
        expect(options.length).toBe(2);
        expect(options[0].attributes().value).toBe('code 1');
        expect(options[0].text()).toBe('description 1');
        expect(options[1].attributes().value).toBe('code 2');
        expect(options[1].text()).toBe('description 2');

        const feedback = wrapper.find('div.invalid-feedback');
        expect(feedback.exists()).toBe(true);
        const warning = wrapper.find('div.invalid-feedback span');
        expect(warning.exists()).toBe(false);
        const extraWarning = wrapper.find('div.invalid-feedback span span');
        expect(extraWarning.exists()).toBe(false);
    });

    it('renders properly with all properties', () => {
        const wrapper = mount(FormSelect, { props: ALL_PROPS });

        const props = wrapper.getComponent(FormSelect).props();
        expect(props.id).toBe('my-select');
        expect(props.name).toBe('my-select');
        expect(props.options.length).toBe(2);
        expect(props.options[0].code).toBe('code 1');
        expect(props.options[0].desc).toBe('description 1');
        expect(props.options[1].code).toBe('code 2');
        expect(props.options[1].desc).toBe('description 2');
        expect(props.label).toBe('Select Something');
        expect(props.required).toBe(true);
        expect(props.placeholder).toBe('Some placeholder text');
        expect(props.warning).toBe('This is a warning');
        expect(props.warningDetail).toBe('Here are more warning details');
        expect(props.value).toBe('');

        expect(wrapper.getComponent(FormSelect).vm.showPlaceholder).toBe(true);

        const label = wrapper.find('label');
        expect(label.attributes().for).toBe('my-select');
        expect(label.classes().length).toBe(1);
        expect(label.classes()[0]).toBe('form-label');
        expect(label.text()).toContain('Select Something:');

        const select = wrapper.find('select');
        const selectAttrs = select.attributes();
        expect(selectAttrs.id).toBe('my-select');
        expect(selectAttrs.name).toBe('my-select');
        expect(select.classes().length).toBe(2);
        expect(select.classes()[0]).toBe('form-select');
        expect(select.classes()[1]).toBe('form-control');
        expect(select.element.value).toBe('');
        expect(select.element.required).toBe(true);

        const options = wrapper.findAll('option');
        expect(options.length).toBe(3);
        expect(options[0].attributes().value).toBe('');
        expect(options[0].text()).toBe('Some placeholder text');
        expect(options[1].attributes().value).toBe('code 1');
        expect(options[1].text()).toBe('description 1');
        expect(options[2].attributes().value).toBe('code 2');
        expect(options[2].text()).toBe('description 2');

        const feedback = wrapper.find('div.invalid-feedback');
        expect(feedback.exists()).toBe(true);
        const warning = wrapper.find('div.invalid-feedback span');
        expect(warning.text()).toContain('This is a warning');
        const extraWarning = wrapper.find('div.invalid-feedback span span');
        expect(extraWarning.text()).toBe('Here are more warning details');
    });

    it('select updates value and triggers change events when changed', async () => {
        const changeHandler = sinon.stub();
        const props = {...ALL_PROPS, onchange: changeHandler};
        const wrapper = mount(FormSelect, { props });

        const select = wrapper.find('select');
        await select.setValue('code 2');
        const emits = wrapper.emitted()['select-changed-value'][0];
        expect(emits[0]).toBe('my-select');
        expect(emits[1]).toBe('code 2');
        expect(changeHandler.called).toBe(true);
        expect(wrapper.getComponent(FormSelect).vm.selectedValue).toBe('code 2');
    });
});
