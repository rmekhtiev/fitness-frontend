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
                v-model="value.user_id"
                :disabled="isHallAdmin"
                :items="users"

                label="Сотрудник"
                item-text="name"
                item-value="id">
        </v-autocomplete>
        <v-textarea
                v-model="value.description"
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
            users: {
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
                    hall_id: this.me.associated_employee ? this.me.associated_employee.hall_id : null,
                    user_id: this.me.id,
                    description: null,
                    status: 'pending',

                }
            }
        },

        created() {
            let newVal = { ...this.value };

            _(this.defaultForm).each((item, index) => {
                if(!this.value[index] || this.value[index] === null) {
                    newVal[index] = item;
                }
            });

            this.$emit('input', newVal)
        },
    }
</script>

<style scoped>

</style>
