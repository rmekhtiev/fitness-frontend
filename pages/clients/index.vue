<template>
  <div id="clients">
    <v-data-iterator :items="clients" :items-per-page="15">
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
                Абонемент
              </div>
            </div>
          </v-flex>

          <v-flex md3>

          </v-flex>

          <v-flex md3>
            <div style="display: flex; width: 100%">
              <div style="flex: 1 1 0%;" class="overline text-truncate text-right">
                Последнее посещение
              </div>
            </div>
          </v-flex>
        </v-layout>
      </template>

      <template v-slot:default="props">
        <v-card>
          <v-list>
            <template v-for="(item, index) in props.items">
              <client-list-item :client="item"></client-list-item>
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
    import {mapGetters} from 'vuex';
    import ClientListItem from '../../components/clients/ClientListItem';

    export default {
        components: {
            'client-list-item': ClientListItem,
        },

        computed: {
            ...mapGetters({
                clients: 'clients/all',
            }),
        },

        fetch({store}) {
            return Promise.all([
                store.dispatch('clients/loadAll'),
                store.dispatch('halls/loadAll'),
            ]);
        },
    }
</script>

<style scoped>

</style>
