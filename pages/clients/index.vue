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
        />
      </v-flex>

      <v-flex md3 class="hidden-sm-and-down">
        <v-select
                v-model="filter.status"
                :items="statuses"
                label="Статус"
                single-line
                filled
                clearable
                @input="loadFiltered"
        />
      </v-flex>
    </v-layout>

    <v-data-iterator
      :items="items"
      :options.sync="iteratorOptions"
      :server-items-length="totalItems"
      :loading="itemsLoading"
      :items-per-page="15"
    >
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
                />
              </v-list-item>
            </template>
            <template v-for="(item, index) in props.items" v-else>
              <v-list-item
                :to="{ name: 'clients-id', params: { id: item.id } }"
              >
                <client-list-item :client="item" />
              </v-list-item>
              <v-divider v-if="index + 1 < props.items.length" :key="index" />
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

    <client-dialog ref="createDialog" title="Новый клиент" />
  </div>
</template>

<script>
import _ from "lodash"

import serverSidePaginated from "../../mixins/server-side-paginated"
import selectedHallAware from "../../mixins/selectedHallAware"

import ClientListItem from "../../components/clients/ClientListItem"
import ClientDialog from "../../components/clients/ClientDialog"

export default {
  head() {
    return {
      title: "Клиенты"
    }
  },

  components: {
    ClientDialog,
    ClientListItem
  },

  mixins: [selectedHallAware, serverSidePaginated],

  data: () => ({
    resource: "clients",
    statuses: [
      { value: "frozen", text: "Заморожен" },
      { value: "active", text: "Активные" },
      { value: "expired", text: "Просрочен" },
      { value: "no_subscription", text: "Без абонемента" },
      { value: "not_activated", text: "Не активирован" },
    ]
  }),

  computed: {

    pureFilter: function() {
      return _({
        primary_hall_id: this.selectedHallId,
        ...this.filter
      })
        .omitBy(_.isNull)
        .omitBy(_.isUndefined)
        .value()
    }


  },

  // created() {
  //   this.interval = setInterval(() => this.loadParams(), 1000);
  // },

  fetch({ store, params }) {
    return Promise.all([
      store.dispatch("halls/loadAll"),

      store.dispatch("clients/loadPage", {
      options: {
        per_page: -1
      }
      })
    ])
  },

  methods: {

    loadParams() {
      console.log(this.$route.params.status)
    },

    openCreateDialog() {
      this.$refs.createDialog.open().then(form => {
        this.$axios.post("clients", form).then(async response => {
          await this.$store.dispatch("clients/loadById", {
            id: response.data.data.id
          })
          this.$router.push({
            name: "clients-id",
            params: { id: response.data.data.id }
          })
        })
      })
    },

    loadRelated() {
      let clientIds = this.items
        .map(client => client.id)
        .filter((value, index, self) => self.indexOf(value) === index)
        .filter(value => value !== null)

      return this.$store.dispatch("subscriptions/loadWhere", {
        filter: {
          client_id: clientIds
        },
        options: {
          per_page: -1
        }
      })
    }
  }
}
</script>

<style scoped></style>
