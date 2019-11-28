<template>
  <div id="employees">
    <v-layout id="filters">
      <v-flex xs12>
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

          <v-flex md3 />

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
            <template v-for="(item, index) in props.items" v-else>
              <employee-list-item :employee="item" />
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
      @click.native="openEmployeeDialog"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <employee-dialog ref="employeeDialog" title="Создать работника" />
  </div>
</template>

<script>
import _ from "lodash";

import serverSidePaginated from "../../mixins/server-side-paginated";
import selectedHallAware from "../../mixins/selected-hall-aware";

import EmployeeListItem from "../../components/employees/EmployeeListItem";
import EmployeeDialog from "../../components/employees/EmployeeDialog";

export default {
  head() {
    return {
      title: "Сотрудники"
    };
  },

  components: {
    EmployeeListItem,
    EmployeeDialog
  },

  mixins: [selectedHallAware, serverSidePaginated],

  data: () => ({
    resource: "employees"
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
      store.dispatch("employees/loadAll"),
      store.dispatch("halls/loadAll"),
      store.dispatch("users/loadAll") // todo: load only related
    ]);
  },

  methods: {
    loadRelated() {
      const userIds = this.items
        .map(employee => employee.associated_user_id)
        .filter((value, index, self) => self.indexOf(value) === index)
        .filter(value => value !== null);

      return this.$store.dispatch("users/loadWhere", {
        filter: {
          id: userIds
        },
        options: {
          per_page: -1
        }
      });
    },
    openEmployeeDialog() {
      this.$refs.employeeDialog.open().then(form => {
        this.$axios.post("employees", form).then(async response => {
          await this.$store.dispatch("employees/loadById", {
            id: response.data.data.id
          });
          this.$router.push({
            name: "employees-id",
            params: { id: response.data.data.id }
          });
        });
      });
    }
  }
};
</script>

<style scoped></style>
