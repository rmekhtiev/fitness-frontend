<template>
  <div id="issues">
    <v-layout id="filters">
      <v-flex xs12 md3>
        <v-text-field
          v-model="filter.topic"

          prepend-inner-icon="search"
          label="Поиск"
          single-line
          filled

          clearable

          @keyup.enter="loadFiltered"
        ></v-text-field>
      </v-flex>

      <v-flex md3 class="hidden-sm-and-down">
        <v-autocomplete
          v-model="filter.employee_id"
          :items="employees"

          item-text="name"
          item-value="id"

          label="Сотрудник"
          single-line
          filled

          clearable

          @input="loadFiltered"
        ></v-autocomplete>
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
        ></v-select>
      </v-flex>
    </v-layout>

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
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                Статус
              </div>
            </div>
          </v-flex>

          <v-flex xs8 md6>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                Проблема
              </div>
            </div>
          </v-flex>

          <v-flex xs8 md3>

          </v-flex>

          <v-flex md3>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate text-right">
                Посл.обновление
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
                ></v-progress-linear>
              </v-list-item>
            </template>
            <template v-else v-for="(item, index) in props.items">
              <v-list-item :to="{name: 'issues-id', params: {id: item.id}}">
                <issue-list-item :issue="item"></issue-list-item>
              </v-list-item>
              <v-divider
                v-if="index + 1 < props.items.length"
                :key="index"
              ></v-divider>
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
      @click.native="openIssueDialog">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <issue-dialog ref="issueDialog" title="Проблема"></issue-dialog>
  </div>
</template>

<script>
    import serverSidePaginated from "../../mixins/server-side-paginated";
    import selectedHallAware from "../../mixins/selectedHallAware";

    import IssueListItem from "../../components/issues/IssueListItem";
    import IssueDialog from "../../components/issues/IssueDialog";
    import employee from "../../mixins/employee";

    export default {
        mixins: [
            serverSidePaginated,
            selectedHallAware,
        ],

        components: {
            IssueDialog,
            IssueListItem,
        },

        data: () => ({
            resource: 'issues',
            statuses: [
                {value: 'pending', text: 'В ожидании'},
                {value: 'in-work', text: 'Выполняется'},
                {value: 'ready', text: 'Готово'},
            ]
        }),

        computed: {
            pureFilter: function () {
                return _({
                    hall_id: this.selectedHallId,
                    ...this.filter
                }).omitBy(_.isNull).omitBy(_.isUndefined).value();
            },

            employees() {
                return this.$store.getters['selectedHall']
                    ? filter(this.$store.getters['employees/all'], item => (item.hall_id === this.$store.getters['selectedHallIdForFilter']))
                    : this.$store.getters['employees/all'];
            },
        },

        methods: {
            openIssueDialog() {
                this.$refs.issueDialog.open().then(form => {
                    this.$axios.post('issues', form)
                        .then(async response => {
                            await this.$store.dispatch('issues/loadById', {id: response.data.data.id});
                            this.$router.push({name: 'issues', params: {id: response.data.data.id}})
                        });
                })
            },

            loadRelated() {
                let employeeIds = this.items
                    .map(issue => (issue.employee_id))
                    .filter((value, index, self) => (self.indexOf(value) === index))
                    .filter(value => value !== null);

                return this.$store.dispatch('employees/loadWhere', {
                    filter: {
                        id: employeeIds,
                    },
                    options: {
                        per_page: -1,
                    }
                });

                // return Promise.resolve();
            }
        },

        fetch({store}) {
            return Promise.all([
                store.dispatch('issues/loadAll'),
                store.dispatch('halls/loadAll'),
            ]);
        },
    }
</script>

<style scoped>

</style>
