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
          <v-btn dark text @click="save">Добавить</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-autocomplete
            v-model="form.client_id"
            :items="availableClients"

            label="Клиент"
            name="client_id"
            prepend-icon="mdi-account"
            item-text="name"
            item-value="id">
          </v-autocomplete>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
    import {filter, pluck} from 'lodash'

    import selectedHallAware from "../../mixins/selectedHallAware";
    import filterable from "../../mixins/filterable";

    export default {
        name: "GroupAddClientDialog",

        mixins: [
            filterable,
            selectedHallAware,
        ],

        props: {
            fullscreen: {
                type: Boolean,
                default: true,
            },

            title: {
                type: String,
                default: "Добавить клиента в группу",
            },

            group: {
                type: Object,
                required: true,
            }
        },

        data: () => ({
            dialog: false,

            resolve: null,
            reject: null,

            form: {},
        }),

        computed: {
            groupClients() {
                return this.$store.getters['clients/related']({
                    parent: {
                        type: 'groups',
                        id: this.group.id,
                    }
                })
            },

            pureClientsFilter: function () {
                return _({
                    primary_hall_id: this.selectedHallId,
                    ...this.filter
                }).omitBy(_.isNull).omitBy(_.isUndefined).value();
            },

            pureClients() {
                return this.$store.getters['clients/where']({
                    filter: this.pureFilter
                })
            },

            availableClients() {
                return this.pureClients.filter(this.selectedHallFilter).filter(item => !this.groupClients.map(client => client.id).includes(item.id));
            },
        },

        watch: {
            selectedHallId() {
                this.loadFilteredClients();
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
            },

            loadFilteredClients() {
                return this.$store.dispatch('clients/loadWhere', {
                    filter: this.pureFilter
                });
            },

            selectedHallFilter(item) {
                return this.selectedHallId === null ? true : item.primary_hall_id === this.selectedHallId;
            }
        },

        mounted() {
          this.loadFilteredClients();
        }
    }
</script>

<style scoped>

</style>
