<template>
    <v-form>
        <v-text-field
                v-model="value.title"
                label="Название"
        ></v-text-field>
        <v-text-field
                v-model="value.amount"
                min="1"
                type="number"

                label="Количество"
        >
        </v-text-field>
        <v-text-field
                v-model="value.cost"
                min="1"
                type="number"

                label="Цена"
        >
        </v-text-field>
        <v-autocomplete
                v-model="value.hall_id"
                :disabled="isHallAdmin || isEdit"
                :items="halls"

                label="Зал"
                item-text="title"
                item-value="id">
        </v-autocomplete>
    </v-form>
</template>

<script>


    import auth from "../../mixins/auth";

    export default {
        name: "BarForm",

        mixins:[
            auth
        ],
        props: {
            value: {
                type: Object,
                default: {}
            },

            halls: {
                type: Array,
            },

            isEdit: {
                type: Boolean,
                default: false,
            },
        },


        computed: {
            defaultForm() {
                return {
                    title: null,
                    amount: null,
                    hall_id: null,
                    cost: null,
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
