<template>
    <v-dialog v-model="dialog" :fullscreen="fullscreen" @keydown.esc="cancel">
        <v-card>
            <v-toolbar dark color="primary" class="mb-4">
                <v-btn icon dark @click="cancel()">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Комментарий к тренировке</v-toolbar-title>
                <div class="flex-grow-1" />
                <v-toolbar-items>
                    <v-btn dark text @click="save">
                        Сохранить
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>

            <v-card-text>
                <training-session-comment-form v-model="form"></training-session-comment-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import _ from "lodash";
    import selectedHallAware from "../../mixins/selected-hall-aware";
    import employee from "../../mixins/employee";
    import TrainingSessionForm from "./TrainingSessionForm";
    import TrainingSessionCommentForm from "./TrainingSessionCommentForm";

    export default {
        name: "TrainingSessionDialog",

        components: {
            TrainingSessionCommentForm,
            TrainingSessionForm
        },
        mixins: [selectedHallAware],

        props: {
            fullscreen: {
                type: Boolean,
                default: true
            },
            session: {
                type: Object,
                required: false,
                default: () => ({})
            },
        },

        data: () => ({
            dialog: false,

            resolve: null,
            reject: null,

            form: {
                comment: null,
            }
        }),

        created() {
            if (this.session) {
                Object.assign(this.form, this.session);
            }
        },

        methods: {
            open() {
                this.dialog = true;

                return new Promise((resolve, reject) => {
                    this.resolve = resolve;
                    this.reject = reject;
                });
            },

            save() {
                this.resolve(this.form);
                this.dialog = false;
            },

            cancel() {
                this.dialog = false;
            }
        }
    };
</script>

<style scoped></style>
