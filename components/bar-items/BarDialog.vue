<template>
    <v-dialog v-model="dialog" :fullscreen="fullscreen" @keydown.esc="cancel">
        <v-card>
            <v-toolbar dark color="primary" class="mb-4">
                <v-btn icon dark @click="cancel()">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <div class="flex-grow-1"></div>
                <v-toolbar-items>
                    <v-btn dark text @click="save">Сохранить</v-btn>
                </v-toolbar-items>
            </v-toolbar>

            <v-card-text>
                <bar-edit-form v-model="form" :is-edit="isEdit" :halls="halls"></bar-edit-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import BarEditForm from "./BarForm";

    export default {
        name: "BarEditDialog",

        components:{
            BarEditForm,
        },

        computed:{
            halls() {
                return this.$store.getters['halls/all'];
            },
        },

        props: {
            fullscreen: {
                type: Boolean,
                default: true,
            },

            title: {
                type: String,
            },

            barItem: {
                type: Object,
                required: false,
            },

            isEdit: {
                type: Boolean,
                default: false,
            },
        },
        data: () => ({
            dialog: false,

            resolve: null,
            reject: null,

            form: {
                title: null,
                amount: null,
                cost: null,
                hall_id: null,
            },
        }),

        created() {
            // console.log(this.barItem);

            if(this.barItem) {
                Object.assign(this.form, this.barItem);
            }
        },

        methods: {
            open(options) {
                this.dialog = true;

                return new Promise((resolve, reject) => {
                    this.resolve = resolve;
                    this.reject = reject
                })
            },

            save() {
                this.resolve(this.form);
                this.dialog = false;
            },

            cancel() {
                this.dialog = false;
            }
        },
    }
</script>

<style scoped>

</style>
