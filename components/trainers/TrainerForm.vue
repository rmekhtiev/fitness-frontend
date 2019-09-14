<template>
    <v-form>
        <v-autocomplete
                v-model="value.associated_employee_id"
                :items="employees"

                :disabled="isEdit"

                label="Сотрудник"
                prepend-icon="mdi-account-badge-horizontal-outline"
                item-text="name"
                item-value="id">
        </v-autocomplete>
        <v-text-field
                v-model="value.phone_number"
                v-mask="'+7 (###) ###-##-##'"
                prepend-icon="mdi-phone-outline"
                label="Номер телефона"
        ></v-text-field>
    </v-form>
</template>

<script>
    import { mask } from 'vue-the-mask'

    import auth from '../../mixins/auth'

    export default {
        name: "IssueForm",

        directives: {
            mask,
        },

        props: {
            value: {
                type: Object,
                default: {}
            },

            employees: {
                type: Array,
            },

            isEdit: {
                type: Boolean,
                default: false,
            },
        },

        mixins: [
            auth,
        ],

        computed: {
            defaultForm() {
                return {
                    phone_number: null,
                    associated_employee_id: null,
                }
            }
        },

        created() {
            let newVal = { ...this.value };

            _(this.defaultForm).each((item, index) => {
                if(!this.value[index]) {
                    newVal[index] = item;
                }
            });

            this.$emit('input', newVal)
        },
    }
</script>

<style scoped>

</style>
