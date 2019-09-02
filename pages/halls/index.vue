<template>
  <div id="halls">
    <v-data-iterator :items="halls" :items-per-page="50">
      <template v-slot:header>
        <v-layout class="px-4 mt-2 mb-3" style="color: rgba(0, 0, 0, .54);">
          <v-flex xs8 md3>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                Зал
              </div>
            </div>
          </v-flex>

          <v-flex md1>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                Клиенты
              </div>
            </div>
          </v-flex>

          <v-flex md1>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                Шкафчики
              </div>
            </div>
          </v-flex>

          <v-flex md1>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate">
                Сотрудники
              </div>
            </div>
          </v-flex>
        </v-layout>
      </template>

      <template v-slot:default="props">
        <v-card>
          <v-list>
            <template v-for="item in props.items">
              <hall-list-item :hall="item"></hall-list-item>
              <v-divider></v-divider>
            </template>
          </v-list>
        </v-card>
      </template>
    </v-data-iterator>
  </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import HallListItem from "../../components/hall/HallListItem";

    export default {
        name: "index",

        components: {
            HallListItem,
        },

        computed: {
            ...mapGetters({
                halls: 'halls/all',
            }),
        },

        fetch({store}) {
            return Promise.all([
                store.dispatch('halls/loadAll'),
            ]);
        },
    }
</script>

<style scoped>

</style>
