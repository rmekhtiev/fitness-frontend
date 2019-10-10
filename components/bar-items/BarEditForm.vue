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
    </v-form>
</template>

<script>


    export default {
        name: "BarItemForm",


        props: {
            value: {
                type: Object,
                default: {}
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
