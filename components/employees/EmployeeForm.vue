<template>
    <v-form>
        <v-text-field
                v-model="value.last_name"
                label="Фамилия"
        ></v-text-field>
        <v-text-field
                v-model="value.first_name"
                label="Имя"
        ></v-text-field>

        <v-text-field
                v-model="value.middle_name"
                label="Отчество"
        ></v-text-field>
        <v-autocomplete
                v-model="value.hall_id"
                :items="halls"
                label="Зал"
                item-text="title"
                item-value="id">
        </v-autocomplete>
    </v-form>
</template>

<script>
    import { mask } from 'vue-the-mask'

    import auth from '../../mixins/auth'

    export default {
        name: "EmployeeForm",

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

            halls: {
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
                    first_name: null,
                    middle_name: null,
                    last_name: null,
                    hall_id: this.$store.getters['selectedHallId'] ? this.$store.getters['selectedHallId'] : null,
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
