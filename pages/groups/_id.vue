<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12 sm6 lg4 xl3>
        <group-info-card
          :group="group"
          class="mb-2 mx-auto">
        </group-info-card>
      </v-flex>
    </v-layout>

    <v-data-iterator :items="clients" :items-per-page="15">
      <template v-slot:header>
        <v-layout class="px-4 mt-2 mb-  3" style="color: rgba(0, 0, 0, .54);">
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

    <v-speed-dial
      v-model="fab"
      fixed
      bottom
      right>
      <template v-slot:activator>
        <v-btn
          v-model="fab"
          color="primary"
          dark
          fab
        >
          <v-icon v-if="fab">mdi-close</v-icon>
          <v-icon v-else>mdi-plus</v-icon>
        </v-btn>
      </template>

      <v-tooltip
        v-if="group.clients_count < group.max_members"
        left
        :value="tooltips">
        <template v-slot:activator="{ on }">
          <v-btn fab dark small color="green" @click="addClientToGroup">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <span>Клиент</span>
      </v-tooltip>

    </v-speed-dial>

    <group-add-client-dialog ref="addClient" :group="group"></group-add-client-dialog>
  </div>
</template>

<script>
    import {filter} from 'lodash';

    import group from "../../mixins/group";

    import ClientListItem from '../../components/clients/ClientListItem';
    import GroupInfoCard from "../../components/groups/GroupInfoCard";
    import GroupAddClientDialog from "../../components/groups/GroupAddClientDialog";

    export default {
        mixins: [
            group,
        ],

        components: {
            ClientListItem,
            GroupInfoCard,
            GroupAddClientDialog,
        },

        data: () => ({
            fab: false,
            tooltips: false,
            tooltipsDisabled: false,
        }),

        computed: {
            clients() {
                return this.$store.getters['clients/related']({
                    parent: {
                        type: 'groups',
                        id: this.$route.params.id,
                    }
                });
            },

            group() {
                return this.$store.getters['groups/byId']({id: this.$route.params.id});
            },
        },

        watch: {
            fab(val) {
                this.tooltips = false;
                this.tooltipsDisabled = false;
                val && setTimeout(() => {
                    this.tooltips = true;
                    this.$nextTick(() => this.tooltipsDisabled = true)
                }, 250)
            },
        },

        methods: {
            addClientToGroup() {
              this.$refs.addClient.open().then(form => {
                  console.log(form);
              });
            },
        },

        fetch({store, params}) {
            return Promise.all([
                store.dispatch('halls/loadAll'),
                store.dispatch('trainers/loadAll'),

                store.dispatch('clients/loadRelated', {
                    parent: {
                        type: 'groups',
                        id: params.id,
                    }
                }),

                store.dispatch('groups/loadById', {id: params.id}).then(async () => {
                    let group = store.getters['groups/byId']({id: params.id}),
                        promises = [];

                    if (group.trainer_id) {
                        promises.push(store.dispatch('trainers/loadById', {id: group.trainer_id}))
                    }

                    if (group.hall_id) {
                        promises.push(store.dispatch('halls/loadById', {id: group.hall_id}))
                    }

                    return await Promise.all(promises);
                }),
            ]);
        },
    }
</script>

<style scoped>

</style>
