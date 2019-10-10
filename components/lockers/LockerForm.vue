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
        <v-text-field
                v-model="value.number"

                label="Номер шкафчика"
        ></v-text-field>
    </v-form>
</template>

<script>
    import auth from '../../mixins/auth'
    export default {
        name: "LockerForm",

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



        mixins: [
            auth,
        ],

        computed: {
            defaultForm() {
                return {
                    hall_id: this.$store.getters['selectedHallId'] ? this.$store.getters['selectedHallId'] : null,
                    number: null,
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
