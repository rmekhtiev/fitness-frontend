<template>
  <div id="training-sessions" class="">
    <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="iteratorOptions"
      :server-items-length="totalItems"
      :loading="itemsLoading"
      :items-per-page="15"
      multi-sort
      class="elevation-1"
    >
      <template v-slot:item.client_id="{ item }">
        <v-skeleton-loader
          :loading="
            typeof $store.getters['clients/byId']({ id: item.client_id }) ===
              'undefined'
          "
          type="table-cell"
        >
          <router-link :to="{ name: 'clients-id', params: { id: item.client_id }}">
            {{
            $store.getters["clients/byId"]({ id: item.client_id })
            ? $store.getters["clients/byId"]({ id: item.client_id }).name
            : "Неизвестно"
            }}
          </router-link>
        </v-skeleton-loader>
      </template>

      <template v-slot:item.trainer_id="{ item }">
        <v-skeleton-loader
          :loading="
            typeof $store.getters['trainers/byId']({ id: item.trainer_id }) ===
              'undefined'
          "
          type="table-cell"
        >
          <router-link :to="{ name: 'trainers-id', params: { id: item.trainer_id } }">
            {{
            $store.getters["trainers/byId"]({ id: item.trainer_id })
            ? $store.getters["trainers/byId"]({ id: item.trainer_id }).name
            : "Неизвестно"
            }}
          </router-link>
        </v-skeleton-loader>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import _ from "lodash";

import serverSidePaginated from "../../mixins/server-side-paginated";
import selectedHallAware from "../../mixins/selected-hall-aware";
import { safeMixin } from "../../mixins/safe";

export default {
  mixins: [selectedHallAware, serverSidePaginated, safeMixin],

  head() {
    return {
      title: "Клиенты"
    };
  },

  data: () => ({
    resource: "training-sessions",
    headers: [
      { text: "Клиент", sortable: false, value: "client_id" },
      { text: "Тренер", sortable: false, value: "trainer_id" },
      { text: "Кол-во занятий", sortable: true, value: "count" }
    ]
  }),

  computed: {
    pureFilter() {
      return _({
        primary_hall_id: this.selectedHallId,
        ...this.filter
      })
        .omitBy(_.isNull)
        .omitBy(_.isUndefined)
        .value();
    }
  },

  methods: {
    loadRelated() {
      const loadClients = this.$store.dispatch("clients/loadWhere", {
        filter: {
          id: _(this.items)
            .map("client_id")
            .flatten()
        }
      });

      const loadTrainers = this.$store.dispatch("trainers/loadWhere", {
        filter: {
          id: _(this.items)
            .map("trainer_id")
            .flatten()
        }
      });

      return Promise.all([loadClients, loadTrainers]);
    }
  }
};
</script>

<style scoped></style>
