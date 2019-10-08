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

          @keyup.enter="loadItems"
        ></v-text-field>
      </v-flex>
    </v-layout>

    <v-data-iterator
      :items="items"
      :options.sync="iteratorOptions"
      :server-items-length="totalItems"
      :loading="itemsLoading"

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
            <template v-if="itemsLoading">
              <v-list-item>
                <v-progress-linear
                  color="primary accent-4"
                  indeterminate
                  rounded
                  height="6"
                ></v-progress-linear>
              </v-list-item>
            </template>
            <template v-else v-for="(item, index) in props.items">
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
    import serverSidePaginated from "../../mixins/server-side-paginated";
    import selectedHallAware from "../../mixins/selectedHallAware";

    import ClientListItem from '../../components/clients/ClientListItem';
    import ClientDialog from "../../components/clients/ClientDialog";

    export default {
        components: {
            ClientDialog,
            ClientListItem,
        },

        mixins: [
            selectedHallAware,
            serverSidePaginated,
        ],

        data: () => ({
            resource: 'clients',
        }),

        computed: {
            pureFilter: function () {
                return _({
                    primary_hall_id: this.selectedHallId,
                    ...this.filter
                }).omitBy(_.isNull).omitBy(_.isUndefined).value();
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
        },

        fetch({store}) {
            return Promise.all([
                store.dispatch('halls/loadAll'),

                store.dispatch('subscriptions/loadAll'),

                store.dispatch('clients/loadPage', {
                    options: {
                        page: 1,
                    }
                })
            ]);
        },
    }
</script>

<style scoped>

</style>
