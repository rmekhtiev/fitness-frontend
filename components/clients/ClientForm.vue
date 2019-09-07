<template>
  <v-form>

  </v-form>
</template>

<script>
    export default {
        name: "ClientForm",

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
