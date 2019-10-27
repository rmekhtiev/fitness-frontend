<template>
  <div id="requests">
    <v-data-iterator
      :items="items"
      :options.sync="iteratorOptions"
      :server-items-length="totalItems"
      :loading="itemsLoading"
      :items-per-page="15"
    >
      <template v-slot:header>
        <v-layout class="px-4 mt-2 mb-3" style="color: rgba(0, 0, 0, .54);">
          <v-flex xs4 md4>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                ФИО
              </div>
            </div>
          </v-flex>

          <v-flex xs3 md3>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                Номер телефона
              </div>
            </div>
          </v-flex>

          <v-flex xs3 md3>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                Дата
              </div>
            </div>
          </v-flex>

          <v-flex xs2 md2></v-flex>

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
              <request-list-item :request="item" />
              <v-divider v-if="index + 1 < props.items.length" :key="index" />
            </template>
          </v-list>
        </v-card>
      </template>
    </v-data-iterator>
  </div>
</template>

<script>

  import serverSidePaginated from "../../mixins/server-side-paginated";
import RequestListItem from "../../components/requests/RequestListItem";

export default {
  head(){
    return {
      title: "Заявки"
    };
  },

  mixins: [serverSidePaginated],

  components: {
    RequestListItem
  },

  data: () => ({
    resource: "requests",
  }),

  computed: {

  },

  fetch({ store }) {
    return Promise.all([
      store.dispatch("requests/loadAll"),
    ]);
  },

};
</script>

<style scoped></style>
