<template>
  <v-dialog v-model="dialog" :fullscreen="fullscreen" @keydown.esc="close">
    <v-card>
      <v-toolbar dark color="primary" class="mb-4">
        <v-btn icon dark @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Поиск</v-toolbar-title>
        <div class="flex-grow-1" />
        <v-toolbar-items>
          <v-btn dark text @click="close()">
            Закрыть
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <v-text-field
          v-model="search"
          prepend-inner-icon="search"
          label="Поиск"
          single-line
          filled
          clearable
          @keyup.enter="loadFiltered"
        />

        <v-btn block outlined color="primary" @click="loadFiltered">
          Искать
        </v-btn>
      </v-card-text>

      <v-data-iterator
        :items="items"
        :options.sync="iteratorOptions"
        :server-items-length="totalItems"
        :loading="itemsLoading"
        :items-per-page="30"
      >
        <template v-slot:header>
          <v-layout class="px-4 mt-2 mb-3" style="color: rgba(0, 0, 0, .54);">
            <v-flex xs8 md3>
              <div style="display: flex; width: 100%">
                <div style="flex: 1 1 0%;" class="overline text-truncate">
                  ФИО
                </div>
              </div>
            </v-flex>

            <v-flex md3>
              <div style="display: flex; width: 100%">
                <div style="flex: 1 1 0%;" class="overline text-truncate">
                  Абонемент
                </div>
              </div>
            </v-flex>

            <v-flex md3 />

            <v-flex md3>
              <div style="display: flex; width: 100%">
                <div
                  style="flex: 1 1 0%;"
                  class="overline text-truncate text-right"
                >
                  Последнее посещение
                </div>
              </div>
            </v-flex>
          </v-layout>
        </template>

        <template v-slot:default="props">
          <v-card>
            <v-list flat>
              <template v-for="(item, index) in props.items">
                <v-list-item
                  :to="{ name: 'clients-id', params: { id: item.id } }"
                >
                  <client-list-item :client="item" @click.native="close" />
                </v-list-item>
                <v-divider v-if="index + 1 < props.items.length" :key="index" />
              </template>
            </v-list>
          </v-card>
        </template>
      </v-data-iterator>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from "lodash";
import serverSidePaginated from "../mixins/server-side-paginated";
import ClientListItem from "./clients/ClientListItem";

export default {
  name: "ClientSearchDialog",

  components: {
    ClientListItem
  },
  mixins: [serverSidePaginated],

  props: {
    fullscreen: {
      type: Boolean,
      default: true
    }
  },

  data: () => ({
    resource: "clients",
    dialog: false,

    resolve: null,
    reject: null,

    search: null,
    iteratorOptions: {
      itemsPerPage: 30,
      page: 1
    }
  }),

  computed: {
    pureFilter() {
      return _({
        search: this.search
      })
        .omitBy(_.isNull)
        .omitBy(_.isUndefined)
        .value();
    },
    serverPayload() {
      return {
        filter: { search: this.search },
        options: {
          page: this.iteratorOptions.page,
          per_page: this.iteratorOptions.itemsPerPage,
          sort: this.sortString
        }
      };
    }
  },

  methods: {
    loadFiltered() {
      this.loadItems();
    },

    open() {
      this.dialog = true;
    },

    close() {
      this.dialog = false;
    }
  }
};
</script>

<style scoped></style>
