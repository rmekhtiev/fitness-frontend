<template>
  <div id="issues">
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

          <v-flex xs8 md3>

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

    import IssueListItem from "../../components/issues/IssueListItem";
    import IssueDialog from "../../components/issues/IssueDialog";

    export default {
        name: "index",
        components: {
            IssueDialog,
            IssueListItem,
        },

        computed: {
            issues() {
                return this.$store.getters['selectedHall']
                    ? filter(this.$store.getters['issues/all'], item => (item.hall_id === this.$store.getters['selectedHallIdForFilter']))
                    : this.$store.getters['issues/all'];
            }
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
