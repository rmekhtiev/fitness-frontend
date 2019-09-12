<template>
  <div id="lockers">
    <v-data-iterator :items="lockers" :items-per-page="50">
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
    import { filter } from 'lodash';
    import LockerListItem from "../../components/lockers/LockerListItem";

    export default {
        name: "index",

        components: {
            LockerListItem,
        },

        computed: {
            lockers() {
                return this.$store.getters['selectedHall']
                    ? filter(this.$store.getters['lockers/all'], item => (item.hall_id === this.$store.getters['selectedHallIdForFilter']))
                    : this.$store.getters['lockers/all'];
            }
        },

        fetch({store}) {
            return Promise.all([
                store.dispatch('lockers/loadAll').then(async () => {
                    let clientIds =  store.getters['lockers/all']
                        .filter(locker => (locker.claim))
                        .map(locker => (locker.claim.client_id))
                        .filter((value, index, self) => (self.indexOf(value) === index));

                    return store.dispatch('clients/loadWhere', {
                        filter: {
                            client_id: clientIds,
                        }
                    });
                }),
            ]);
        },
    }
</script>

<style scoped>

</style>
