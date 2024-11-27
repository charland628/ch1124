<template>
    <div>
        <label
            :for="name"
            class="form-label"
        >
            {{ label }}:
        </label>
        <input
            type="number"
            :id="id"
            :name="name"
            class="form-control"
            :required="required"
            :min="min"
            :max="max"
            v-model="inputValue"
            @change="handleInputChange"
        >
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
                inputValue: this.value,
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

            min: {
                type: Number,
                required: false,
            },

            max: {
                type: Number,
                required: false,
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
                type: Number,
                required: false,
                default: 0,
            },
        },

        emits: ['input-changed-value'],

        methods: {
            handleInputChange() {
                this.$emit('input-changed-value', this.name, this.inputValue);
            },
        },
    };
</script>
