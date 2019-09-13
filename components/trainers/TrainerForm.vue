<template>
    <v-form>
        <v-autocomplete
                v-model="value.associated_employee_id"
                :items="associatedEmployees"

                label="Сотрудник"
                item-text="name"
                item-value="id">
        </v-autocomplete>
        <v-text-field
                v-model="value.phone_number"
                label="Номер телефона"
        ></v-text-field>
    </v-form>
</template>

<script>
    import auth from '../../mixins/auth'
    export default {
        name: "IssueForm",

        props: {
            value: {
                type: Object,
                default: {}
            },
            associatedEmployees: {
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
