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
                <trainer-form v-model="form" :is-edit="isEdit" :associatedEmployees="associatedEmployees" ></trainer-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import TrainerForm from "./TrainerForm";
    export default {
        name: "TrainerDialog",

        components: {
            TrainerForm,
        },

        computed: {
            halls() {
                return this.$store.getters['halls/all'];
            },
            associatedEmployees() {
                return this.$store.getters['employees/all'];
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
                phone_number: null,
                associated_employee_id: null,
            },
        }),

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
