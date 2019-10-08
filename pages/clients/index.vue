<template>
  <div id="clients">
    <v-layout id="filters">
      <v-flex md3 class="hidden-sm-and-down">
        <v-text-field
          v-model="filter.search"

          prepend-inner-icon="search"
          label="Поиск"
          single-line
          filled

          clearable

          @keyup.enter="loadFiltered"
        ></v-text-field>
      </v-flex>
    </v-layout>

    <v-data-iterator
      :items="clients"
      :options.sync="options"
      :server-items-length="totalClients"
      :loading="loading"

      :items-per-page="15">
      <template v-slot:header>
        <v-layout class="px-4 mt-2 mb-3" style="color: rgba(0, 0, 0, .54);">
          <v-flex xs6 md4>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                ФИО
              </div>
            </div>
          </v-flex>

          <v-flex md4>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                Абонемент
              </div>
            </div>
          </v-flex>
        </v-layout>
      </template>

      <template v-slot:default="props">
        <v-card>
          <v-list>
            <template v-for="(item, index) in props.items">
              <v-list-item :to="{name: 'clients-id', params: {id: item.id}}">
                <client-list-item :client="item"></client-list-item>
              </v-list-item>
              <v-divider
                v-if="index + 1 < props.items.length"
                :key="index"
              ></v-divider>
            </template>
          </v-list>
        </v-card>
      </template>
    </v-data-iterator>

    <v-btn
      color="primary"
      dark
      fab
      fixed
      bottom
      right
      @click="openCreateDialog"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <client-dialog ref="createDialog" title="Новый клиент"></client-dialog>
  </div>
</template>

<script>
    import {filter} from 'lodash';

    import filterable from "../../mixins/filterable";
    import selectedHallAware from "../../mixins/selectedHallAware";

    import ClientListItem from '../../components/clients/ClientListItem';
    import ClientDialog from "../../components/clients/ClientDialog";

    export default {
        components: {
            ClientDialog,
            ClientListItem,
        },

        mixins: [
            filterable,
            selectedHallAware,
        ],

        data: () => ({
            options: {},

            loading: true,
        }),

        computed: {
            pureFilter: function () {
                return _({
                    primary_hall_id: this.selectedHallId,
                    ...this.filter
                }).omitBy(_.isNull).omitBy(_.isUndefined).value();
            },

            pureClients() {
                return this.$store.getters['clients/where']({
                    filter: this.pureFilter,
                    options: {
                        page: this.options.page,
                        per_page: this.options.itemsPerPage,
                    }
                })
            },

            clients() {
                return this.pureClients.filter(this.selectedHallFilter);
            },

            totalClients() {
                return this.$store.getters['clients/lastMeta'].pagination.total;
            }
        },

        watch: {
            selectedHallId() {
                this.loadFiltered();
            },

            options: {
                handler () {
                    this.loadFiltered();
                },
                deep: true,
            },
        },

        methods: {
            openCreateDialog() {
                this.$refs.createDialog.open().then(form => {
                    this.$axios.post('clients', form)
                        .then(async response => {
                            await this.$store.dispatch('clients/loadById', {id: response.data.data.id});
                            this.$router.push({name: 'clients-id', params: {id: response.data.data.id}})
                        });
                })
            },

            loadFiltered() {
                this.loading = true;

                return this.$store.dispatch('clients/loadWhere', {
                    filter: this.pureFilter,
                    options: {
                        page: this.options.page,
                        per_page: this.options.itemsPerPage,
                    }
                }).then(() => {
                    this.loading = false;
                });
            },

            selectedHallFilter(item) {
                return this.selectedHallId === null ? true : item.primary_hall_id === this.selectedHallId;
            }
        },

        async beforeMount() {
            await this.loadFiltered();
        },

        fetch({store}) {
            return Promise.all([
                store.dispatch('halls/loadAll'),

                store.dispatch('subscriptions/loadAll'),

                store.dispatch('clients/loadPage', {
                    options: {
                        page: 1,
                        per_page: 15,
                    }
                }),
            ]);
        },
    }
</script>

<style scoped>

</style>
