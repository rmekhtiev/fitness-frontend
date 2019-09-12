<template>
  <div id="issues">
    <v-layout>

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

    <v-data-iterator :items="issues" :items-per-page="50">
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
            <template v-for="item in props.items">
              <issue-list-item :issue="item"></issue-list-item>
              <v-divider></v-divider>
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
    import {filter} from 'lodash';

    import filterable from '../../mixins/filterable';

    import IssueListItem from "../../components/issues/IssueListItem";
    import IssueDialog from "../../components/issues/IssueDialog";

    export default {
        name: "index",

        components: {
            IssueDialog,
            IssueListItem,
        },

        mixins: [
            filterable,
        ],

        data: () => ({
            statuses: [
                {value: 'pending', text: 'В ожидании'},
                {value: 'in-work', text: 'Выполняется'},
                {value: 'ready', text: 'Готово'},
            ]
        }),

        computed: {
            pureIssues() {
                return _(this.pureFilter).isEmpty() ? this.$store.getters['issues/all'] : this.$store.getters['issues/where']({filter: this.pureFilter})
            },

            issues() {
                return this.$store.getters['selectedHall']
                    ? filter(this.pureIssues, item => (item.hall_id === this.$store.getters['selectedHallIdForFilter']))
                    : this.pureIssues;
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

            loadFiltered() {
                this.$store.dispatch('issues/loadWhere', {filter: this.pureFilter});
            },
        },

        fetch({store}) {
            return Promise.all([
                store.dispatch('issues/loadAll'),
                store.dispatch('halls/loadAll'),
                store.dispatch('employees/loadAll'),
            ]);
        },
    }
</script>

<style scoped>

</style>
