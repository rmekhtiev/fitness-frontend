<template>
    <v-form>
        <v-autocomplete
                v-model="value.hall_id"
                :disabled="isHallAdmin || isEdit"
                :items="halls"

                label="Зал"
                item-text="title"
                item-value="id">
        </v-autocomplete>
        <v-autocomplete
                v-model="value.employee_id"
                :items="employees"

                label="Сотрудник"
                item-text="name"
                item-value="id">
        </v-autocomplete>
        <v-text-field
                v-model="value.topic"

                label="Тема"
                placeholder="Напр.: Сломался тренажер"
        ></v-text-field>
        <v-textarea
                v-model="value.description"

                label="Описание проблемы"
                placeholder="Подробное описание проблемы"
        ></v-textarea>
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

            halls: {
                type: Array,
            },
            employees: {
                type: Array,
            },
            description: {
                type: String,
            },
            status: {
                type: String,
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
                    hall_id: this.$store.getters['selectedHallId'] ? this.$store.getters['selectedHallId'] : null,
                    employee_id: this.me.associated_employee ? this.me.associated_employee.id : null,
                    topic: null,
                    description: null,
                    status: 'pending',
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
