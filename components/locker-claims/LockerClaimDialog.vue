<template>
  <v-dialog v-model="dialog" :fullscreen="fullscreen" @keydown.esc="cancel">
    <v-card>
      <v-toolbar dark color="primary" class="mb-4">
        <v-btn icon dark @click="cancel()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Новая бронь шкафчика</v-toolbar-title>
        <div class="flex-grow-1"></div>
        <v-toolbar-items>
          <v-btn dark text @click="save">Сохранить</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-autocomplete
            v-model="form.hall"
            :disabled="isHallAdmin"
            :items="halls"

            label="Зал"
            item-text="title"
            item-value="id">
          </v-autocomplete>

          <v-autocomplete
            v-model="form.locker"
            :items="lockers"

            label="Шкафчик"
            item-text="number"
            item-value="id">
            <template v-slot:selection="{ item }">
              &numero;{{ item.number }} ({{ $store.getters['halls/byId']({ id: item.hall_id }).title }})
            </template>
            <template v-slot:item="{ item }">
              <locker-list-item :locker="item" hide-client></locker-list-item>
            </template>
          </v-autocomplete>

          <v-dialog
            ref="claimStartDialog"
            v-model="modal.claim_start"
            :return-value.sync="form.claim_start"
            persistent
            full-width
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                :value="$moment(form.claim_start).format('ll')"
                label="Начало брони"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="form.claim_start" scrollable locale="ru-ru">
              <div class="flex-grow-1"></div>
              <v-btn text color="primary" @click="modal.claim_start = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.claimStartDialog.save(form.claim_start)">OK</v-btn>
            </v-date-picker>
          </v-dialog>

          <v-dialog
            ref="claimEndDialog"
            v-model="modal.claim_end"
            :return-value.sync="form.claim_end"
            persistent
            full-width
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                :value="$moment(form.claim_end).format('ll')"
                label="Окончание брони"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="form.claim_end" scrollable locale="ru-ru">
              <div class="flex-grow-1"></div>
              <v-btn text color="primary" @click="modal.claim_end = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.claimEndDialog.save(form.claim_end)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
    import {mapGetters} from 'vuex';

    import auth from '../../mixins/auth'

    import LockerListItem from "../lockers/LockerListItem";

    export default {
        name: "LockerClaimDialog",

        props: {
            fullscreen: {
                type: Boolean,
                default: true,
            },

            client: {
                type: Object,
                required: false,
            }
        },

        components: {
            LockerListItem
        },

        mixins: [
            auth,
        ],

        data: () => ({
            dialog: false,

            resolve: null,
            reject: null,

            form: {
                hall: null,
                locker: null,
                claim_start: null,
                claim_end: null,
            },

            modal: {
                claim_start: false,
                claim_end: false,
            }
        }),

        computed: {
            lockers() {
                return this.$store.getters['lockers/where']({
                    filter: {
                        free: true,
                    }
                })
            },

            formData() {
                return {
                    client_id: this.client.id, // todo

                    locker_id: this.form.locker,
                    claim_start: this.form.claim_start,
                    claim_end: this.form.claim_end,
                }
            },

            ...mapGetters({
                halls: 'halls/all',
            }),
        },

        beforeMount() {
            return Promise.all([ // todo
                this.$store.dispatch('halls/loadAll'),
                this.$store.dispatch('lockers/loadWhere', {
                    filter: {
                        free: true,
                    }
                }),
            ])
        },

        mounted() {
            this.form.hall = this.$store.getters['halls/byId']({id: this.me.associated_employee.hall_id});
            this.form.claim_start = this.$moment().format('YYYY-MM-DD');
            this.form.claim_end = this.$moment().add(2, 'week').format('YYYY-MM-DD');
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
                this.$axios.post('locker-claims', this.formData)
                    .then(async response => {
                        console.log(response);

                        await this.$store.dispatch('locker-claims/loadById', { id: response.data.data.id });
                        let claim = this.$store.getters['locker-claims/byId']({ id: response.data.data.id });

                        console.log(claim);

                        this.resolve(response);
                        this.dialog = false;
                    })
            },

            cancel() {
                this.dialog = false;
            }
        }
    }
</script>

<style scoped>

</style>
