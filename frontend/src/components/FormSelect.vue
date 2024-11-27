<template>
    <div>
        <label
            :for="name"
            class="form-label"
        >
            {{ label }}:
        </label>
        <select
            :id="id"
            :name="name"
            class="form-select form-control"
            :required="required"
            v-model="selectedValue"
            @change="handleSelection"
        >
            <option
                v-if="showPlaceholder"
                disabled
                value=""
            >
                {{ placeholder }}
            </option>
            <option
                v-for="option in options"
                :value="option.code"
            >
                {{ option.desc }}
            </option>
        </select>
        <div class="invalid-feedback">
            <span
                v-if="warning.length"
                class="text-bg-danger"
            >
                {{ warning }}
                <span
                    v-if="warningDetail.length"
                >
                    <br />
                    {{ warningDetail }}
                </span>
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                selectedValue: this.value,
            };
        },

        props: {
            id: {
                type: String,
                required: true,
            },

            name: {
                type: String,
                required: true,
            },

            label: {
                type: String,
                required: false,
                default: '',
            },

            required: {
                type: Boolean,
                required: false,
                default: false,
            },

            options: {
                type: Array,
                required: true,
            },

            placeholder: {
                type: String,
                required: false,
                default: '',
            },

            warning: {
                type: String,
                required: false,
                default: '',
            },

            warningDetail: {
                type: String,
                required: false,
                default: '',
            },

            value: {
                type: String,
                required: false,
                default: '',
            },
        },

        computed: {
            showPlaceholder() {
                return this.placeholder.length > 0;
            },
        },

        emits: ['select-changed-value'],

        methods: {
            handleSelection() {
                this.$emit('select-changed-value', this.name, this.selectedValue);
            },
        },
    };
</script>
