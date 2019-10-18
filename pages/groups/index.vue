<template>
  <div id="clients">
    <v-data-iterator
      :items="items"
      :options.sync="iteratorOptions"
      :server-items-length="totalItems"
      :loading="itemsLoading"
      :items-per-page="15"
    >
      <template v-slot:header>
        <v-layout class="px-4 mt-2 mb-3" style="color: rgba(0, 0, 0, .54);">
          <v-flex xs8 sm4>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                Название
              </div>
            </div>
          </v-flex>

          <v-flex sm3 md4 class="hidden-xs-only">
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                Зал
              </div>
            </div>
          </v-flex>

          <v-flex sm4 md2 class="hidden-xs-only">
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                Следующая тренировка
              </div>
            </div>
          </v-flex>

          <v-flex xs4 sm2>
            <div style="display: flex; width: 100%">
              <div
                style="flex: 1 1 0%;"
                class="overline text-truncate text-right"
              >
                Участники
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
            <template v-for="item in props.items" v-else>
              <v-list-item :to="{ name: 'groups-id', params: { id: item.id } }">
                <group-list-item :group="item" />
              </v-list-item>
              <v-divider />
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
      @click.native="openCreateDialog"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <group-dialog ref="createDialog" title="Создать группу" />
  </div>
</template>

<script>
import _ from "lodash";

import serverSidePaginated from "../../mixins/server-side-paginated";
import selectedHallAware from "../../mixins/selected-hall-aware";

import GroupListItem from "../../components/groups/GroupListItem";
import GroupDialog from "../../components/groups/GroupDialog";

export default {
  head() {
    return {
      title: "Группы"
    };
  },

  components: {
    GroupListItem,
    GroupDialog
  },

  mixins: [serverSidePaginated, selectedHallAware],

  data: () => ({
    resource: "groups"
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
      store.dispatch("groups/loadAll"),
      store.dispatch("halls/loadAll"),
      store.dispatch("trainers/loadAll")
    ]);
  },

  methods: {
    openCreateDialog() {
      this.$refs.createDialog.open().then(form => {
        this.$axios.post("groups", form).then(async response => {
          await this.$store.dispatch("groups/loadById", {
            id: response.data.data.id
          });
          this.$router.push({
            name: "groups-id",
            params: { id: response.data.data.id }
          });
        });
      });
    }
  }
};
</script>

<style scoped></style>
