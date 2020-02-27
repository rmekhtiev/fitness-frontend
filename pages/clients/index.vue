<template>
  <div id="clients">
    <v-layout id="filters">
      <v-flex md3>
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

      <v-flex md3>
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

      <v-flex md3>
        <v-select
          v-model="filter.primary_hall_id"
          :items="halls"
          item-text="title"
          item-value="id"
          label="Зал"
          single-line
          filled
          clearable
          multiple
          @input="loadFiltered"
        />
      </v-flex>
    </v-layout>

    <v-data-iterator
      :items="items"
      :options.sync="iteratorOptions"
      :server-items-length="totalItems"
      :loading="itemsLoading"
      :footer-props="footerProps"
    >
      <template v-slot:header>
        <client-list-header></client-list-header>
      </template>

      <template v-slot:default="props">
        <client-list-card
          :items-loading="itemsLoading"
          :items="props.items"
        ></client-list-card>
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
import _ from "lodash";

import serverSidePaginated from "../../mixins/server-side-paginated";
import selectedHallAware from "../../mixins/selected-hall-aware";

import ClientListHeader from "../../components/clients/ClientListHeader";
import ClientDialog from "../../components/clients/ClientDialog";
import ClientListCard from "../../components/clients/ClientListCard";

export default {
  head() {
    return {
      title: "Клиенты"
    };
  },

  components: {
    ClientListCard,
    ClientDialog,
    ClientListHeader
  },

  mixins: [selectedHallAware, serverSidePaginated],

  data: () => ({
    resource: "clients",
    statuses: [
      { value: "frozen", text: "Заморожен" },
      { value: "active", text: "Активные" },
      { value: "expired", text: "Просрочен" },
      { value: "no_subscription", text: "Без абонемента" },
      { value: "not_activated", text: "Не активирован" }
    ],
    iteratorOptions: {
      itemsPerPage: 50,
      page: 1
    },
    footerProps: { "items-per-page-options": [15, 30, 50] }
  }),

  computed: {
    halls() {
      return this.$store.getters["halls/all"];
    },

    pureFilter() {
      return _({
        ...this.filter
      })
        .omitBy(_.isNull)
        .omitBy(_.isUndefined)
        .value();
    }
  },

  fetch({ store, params }) {
    return Promise.all([
      store.dispatch("halls/loadAll"),

      store.dispatch("clients/loadPage", {
        options: {
          page: 1
        }
      })
    ]);
  },

  methods: {
    openCreateDialog() {
      this.$refs.createDialog.open().then(form => {
        this.$axios.post("clients", form).then(async response => {
          await this.$store.dispatch("clients/loadById", {
            id: response.data.data.id
          });
          this.$router.push({
            name: "clients-id",
            params: { id: response.data.data.id }
          });
        });
      });
    },

    loadRelated() {
      const clientIds = this.items
        .map(client => client.id)
        .filter((value, index, self) => self.indexOf(value) === index)
        .filter(value => value !== null);

      return this.$store.dispatch("subscriptions/loadWhere", {
        filter: {
          client_id: clientIds
        },
        options: {
          per_page: -1
        }
      });
    }
  }
};
</script>

<style scoped></style>
