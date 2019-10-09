<template>
  <div id="clients">
    <v-data-iterator
      :items="items"
      :options.sync="iteratorOptions"
      :server-items-length="totalItems"
      :loading="itemsLoading"

      :items-per-page="15">
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

          </v-flex>

          <v-flex md3>

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
            <template v-else v-for="item in props.items">
              <employee-list-item :employee="item"></employee-list-item>
              <v-divider></v-divider>
            </template>
          </v-list>
        </v-card>
      </template>
    </v-data-iterator>
  </div>
</template>

<script>
    import serverSidePaginated from "../../mixins/server-side-paginated";
    import selectedHallAware from "../../mixins/selectedHallAware";

    import EmployeeListItem from "../../components/employees/EmployeeListItem";

    export default {
        components: {
            EmployeeListItem,
        },

        mixins: [
            serverSidePaginated,
            selectedHallAware,
        ],

        data: () => ({
            resource: 'employees',
        }),

        computed: {
            pureFilter: function () {
                return _({
                    hall_id: this.selectedHallId,
                    ...this.filter
                }).omitBy(_.isNull).omitBy(_.isUndefined).value();
            },
        },

        methods: {
            loadRelated() {
                let userIds = this.items
                    .map(employee => (employee.associated_user_id))
                    .filter((value, index, self) => (self.indexOf(value) === index))
                    .filter(value => value !== null);

                return this.$store.dispatch('users/loadWhere', {
                    filter: {
                        id: userIds,
                    },
                    options: {
                        per_page: -1,
                    }
                });
            }
        },

        fetch({store}) {
            return Promise.all([
                store.dispatch('employees/loadAll'),
                store.dispatch('halls/loadAll'),
                store.dispatch('users/loadAll'), // todo: load only related
            ]);
        },
    }
</script>

<style scoped>

</style>
