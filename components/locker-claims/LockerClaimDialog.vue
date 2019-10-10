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
        <locker-claim-form v-model="form" :halls="$store.getters['halls/all']" :lockers="lockers" :is-edit="isEdit"></locker-claim-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
    import LockerClaimForm from "./LockerClaimForm";

    export default {
        name: "LockerClaimDialog",

        props: {
            fullscreen: {
                type: Boolean,
                default: true,
            },

            title: {
                type: String,
            },

            client: {
                type: Object,
                required: false,
            },

            claim: {
                type: Object,
                required: false
            },

            isEdit: {
                type: Boolean,
                default: false,
            }
        },

        components: {
            LockerClaimForm,
        },

        data: () => ({
            dialog: false,

            resolve: null,
            reject: null,

            form: {
                client_id: null,
                hall_id: null,
                locker_id: null,
                claim_start: null,
                claim_end: null,
            },
        }),

        computed: {
            lockersFilter() {
                return {
                    free: !this.isEdit,
                    hall_id: this.form.hall_id,
                }
            },

            lockers() {
                return this.$store.getters['lockers/where']({
                    filter: this.lockersFilter
                })
            },
        },

        watch: {
            'form.hall_id': function (newVal, oldVal) {
                this.$store.dispatch('lockers/loadWhere', {
                    filter: this.lockersFilter
                });
            }
        },

        beforeMount() {
            return Promise.all([ // todo
                this.$store.dispatch('halls/loadAll'),
            ])
        },

        created() {
            if(this.client) {
                this.form.client_id = this.client.id;
            }

            if(this.claim) {
                Object.assign(this.form, this.claim);
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
        }
    }
</script>

<style scoped>

</style>
