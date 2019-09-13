<template>
    <v-form>
        <v-autocomplete>
        </v-autocomplete>
        <v-autocomplete>
        </v-autocomplete>
        <v-text-field></v-text-field>
        <v-textarea></v-textarea>
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
