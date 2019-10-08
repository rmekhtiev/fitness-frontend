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
            <template v-for="(item, index) in props.items">
              <v-list-item :to="{name: 'lockers-id', params: {id: item.id}}">
                <locker-list-item :locker="item"></locker-list-item>
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
  </div>
</template>

<script>
    import {filter} from 'lodash';

    import serverSidePaginated from "../../mixins/server-side-paginated";
    import selectedHallAware from "../../mixins/selectedHallAware";

    import LockerListItem from "../../components/lockers/LockerListItem";

    export default {
        name: "index",

        components: {
            LockerListItem,
        },

        mixins: [
            serverSidePaginated,
            selectedHallAware,
        ],

        data: () => ({
            resource: 'lockers',
            statuses: [
                {value: 'true', text: 'Свободен'},
                {value: 'false', text: 'Занят'},
            ]
        }),

        computed: {
            pureFilter: function () {
                return _({
                    hall_id: this.selectedHallId,
                    ...this.filter
                }).omitBy(_.isNull).omitBy(_.isUndefined).value();
            },
        },

        watch: {
            selectedHallId() {
                this.loadItems();
            },
        },

        methods: {
            loadRelated() {
                let clientIds = this.items
                    .filter(locker => (locker.claim))
                    .map(locker => (locker.claim.client_id))
                    .filter((value, index, self) => (self.indexOf(value) === index));

                return this.$store.dispatch('clients/loadWhere', {
                    filter: {
                        client_id: clientIds,
                    }
                });
            }
        },

        fetch({store}) {
            return Promise.all([
                store.dispatch('lockers/loadPage', {
                    options: {
                        page: 1
                    }
                }),
            ]);
        },
    }
</script>

<style scoped>

</style>
