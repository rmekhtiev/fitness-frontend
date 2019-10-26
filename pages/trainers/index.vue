<template>
  <div id="trainers">
    <v-data-iterator
      :items="items"
      :options.sync="iteratorOptions"
      :server-items-length="totalItems"
      :loading="itemsLoading"
      :items-per-page="15"
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
                Зал
              </div>
            </div>
          </v-flex>

          <v-flex md3>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                Номер телефона
              </div>
            </div>
          </v-flex>

          <v-flex md3 />
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
            <template v-for="(item,index) in props.items" v-else>
              <v-list-item :to="{ name: 'trainers-id', params: { id: item.id } }">
                <trainer-list-item :trainer="item" />
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
      @click.native="openTrainerDialog"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <trainer-dialog ref="trainerDialog" title="Создать тренера" />
  </div>
</template>

<script>
import _ from "lodash";

import serverSidePaginated from "../../mixins/server-side-paginated";
import selectedHallAware from "../../mixins/selected-hall-aware";

import TrainerListItem from "../../components/trainers/TrainerListItem";
import TrainerDialog from "../../components/trainers/TrainerDialog";

export default {
  head() {
    return {
      title: "Тренеры"
    };
  },

  components: {
    TrainerListItem,
    TrainerDialog
  },

  mixins: [serverSidePaginated, selectedHallAware],

  data: () => ({
    resource: "trainers"
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
      store.dispatch("trainers/loadAll"),
      store.dispatch("halls/loadAll")
    ]);
  },

  methods: {
    openTrainerDialog() {
      this.$refs.trainerDialog.open().then(form => {
        this.$axios.post("trainers", form).then(async response => {
          await this.$store.dispatch("trainers/loadById", {
            id: response.data.data.id
          });
          this.$router.push({
            name: "trainers-id",
            params: { id: response.data.data.id }
          });
        });
      });
    },

    loadRelated() {
      const employeeIds = this.items
        .map(trainer => trainer.associated_employee_id)
        .filter((value, index, self) => self.indexOf(value) === index)
        .filter(value => value !== null);

      return this.$store.dispatch("employees/loadWhere", {
        filter: {
          id: employeeIds
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
