<template>
  <div id="lockers">
    <v-layout id="filters">
      <v-flex xs12 sm6 md3>
        <v-select
          v-model="filter.free"
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
          <v-flex xs2 md1>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                №
              </div>
            </div>
          </v-flex>

          <v-flex xs6 md3>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                Статус
              </div>
            </div>
          </v-flex>

          <v-flex xs4 md3>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                Клиент
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
                :to="{ name: 'lockers-id', params: { id: item.id } }"
              >
                <locker-list-item :locker="item" />
              </v-list-item>
              <v-divider v-if="index + 1 < props.items.length" :key="index" />
            </template>
          </v-list>
        </v-card>
      </template>
    </v-data-iterator>
    <v-btn
      color="blue"
      dark
      absolute
      bottom
      right
      fab
      class="mb-12"
      @click.native="openLockerDialog"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <locker-dialog ref="lockerDialog" title="Создание шкафчика" />
  </div>
</template>

<script>
import _ from "lodash";

import serverSidePaginated from "../../mixins/server-side-paginated";
import selectedHallAware from "../../mixins/selected-hall-aware";

import LockerListItem from "../../components/lockers/LockerListItem";
import LockerDialog from "../../components/lockers/LockerDialog";

export default {
  name: "Index",

  head() {
    return {
      title: "Шкафчики"
    };
  },

  components: {
    LockerListItem,
    LockerDialog
  },

  mixins: [serverSidePaginated, selectedHallAware],

  data: () => ({
    resource: "lockers",
    statuses: [
      { value: "true", text: "Свободен" },
      { value: "false", text: "Занят" }
    ]
  }),

  computed: {
    pureFilter() {
      return _({
        hall_id: this.selectedHallId,
        ...this.filter
      })
        .omitBy(_.isNull)
        .omitBy(_.isUndefined)
        .value();
    }
  },

  fetch({ store }) {
    return Promise.all([
      store.dispatch("lockers/loadPage", {
        options: {
          page: 1
        }
      })
    ]);
  },

  methods: {
    loadRelated() {
      const clientIds = this.items
        .filter(locker => locker.claim)
        .map(locker => locker.claim.client_id)
        .filter((value, index, self) => self.indexOf(value) === index);

      return this.$store.dispatch("clients/loadWhere", {
        filter: {
          client_id: clientIds
        }
      });
    },

    openLockerDialog() {
      this.$refs.lockerDialog.open().then(form => {
        this.$axios.post("lockers", form).then(async response => {
          // await this.$store.dispatch('lockers/loadById', {id: response.data.data.id});
          this.$router.push({
            name: "lockers-id",
            params: { id: response.data.data.id }
          });
        });
      });
    }
  }
};
</script>

<style scoped></style>
