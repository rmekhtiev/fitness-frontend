<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12 sm6 lg4 xl3>
        <group-info-card
          :group="group"
          class="mb-2 mx-auto">
        </group-info-card>
      </v-flex>

      <v-flex xs12 sm6 lg8 xl9>
        <v-card>
          <v-card-text>
            <div class="overline">Тренировки</div>
          </v-card-text>

          <group-event-calendar :group="group"></group-event-calendar>
        </v-card>
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
              <v-list-item :to="{name: 'clients-id', params: {id: item.id}}">
                <v-list-item-content class="py-0">
                  <client-list-item :client="item"></client-list-item>
                </v-list-item-content>

                <v-list-item-action class="my-0">
                  <v-menu bottom left>
                    <template v-slot:activator="{ on }">
                      <v-btn icon @click.prevent="on.click">
                        <v-icon color="grey lighten-1">mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>

                    <v-list dense flat>
                      <v-list-item @click.prevent="removeClientFromGroup(item)">
                        <v-list-item-icon>
                          <v-icon>mdi-close</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content class="pr-6">
                          <v-list-item-title>Убрать</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item-action>
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
          <v-btn fab dark small color="green" @click.native="addClientToGroup">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <span>Клиент</span>
      </v-tooltip>

    </v-speed-dial>

    <group-add-client-dialog ref="addClient" :group="group"></group-add-client-dialog>

    <confirm ref="removeClientConfirm"></confirm>
  </div>
</template>

<script>
    import group from "../../mixins/group";

    import ClientListItem from '../../components/clients/ClientListItem';
    import GroupInfoCard from "../../components/groups/GroupInfoCard";
    import GroupAddClientDialog from "../../components/groups/GroupAddClientDialog";
    import Confirm from "../../components/Confirm";
    import GroupEventCalendar from "../../components/groups/GroupEventCalendar";

    export default {
        mixins: [
            group,
        ],

        components: {
            GroupEventCalendar,
            ClientListItem,
            GroupInfoCard,
            GroupAddClientDialog,
            Confirm
        },

        data: () => ({
            fab: false,
            tooltips: false,
            tooltipsDisabled: false,
        }),

        computed: {
            clients() {
                return this.$store.getters['clients/related']({ // todo: simplify to one function
                    parent: {
                        type: 'groups',
                        id: this.$route.params.id,
                    },
                    options: {
                        per_page: -1,
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
                this.$refs.addClient.open().then(async form => {
                    await this.$axios.put('/groups/' + this.group.id + '/clients/' + form.client_id, form).then(async response => {
                        console.log(response);
                    });

                    await this.$store.dispatch('clients/loadRelated', { // todo: simplify to one function
                        parent: {
                            type: 'groups',
                            id: this.group.id,
                        },
                        options: {
                            per_page: -1,
                        }
                    })
                });
            },

            removeClientFromGroup(client) {
                console.log(client);

                this.$refs.removeClientConfirm.open('Убрать клиента ' + client.name + ' из группы', 'Вы уверены?', {color: 'red'}).then(async (confirm) => {
                    console.log(confirm);

                    if (confirm) {
                        await this.$axios.delete('/groups/' + this.group.id + '/clients/' + client.id).then(async response => {
                            console.log(response);
                        });

                        await this.$store.dispatch('clients/loadRelated', { // todo: simplify to one function
                            parent: {
                                type: 'groups',
                                id: this.group.id,
                            },
                            options: {
                                per_page: -1,
                            }
                        })
                    }
                })
            },
        },

        mounted() {

        },

        fetch({store, params}) {
            return Promise.all([
                store.dispatch('halls/loadAll'), // todo: load related
                store.dispatch('trainers/loadAll'), // todo: load related

                store.dispatch('groups/loadById', {id: params.id}).then(async () => {
                    let group = store.getters['groups/byId']({id: params.id}),
                        promises = [];

                    if (group.trainer_id) {
                        promises.push(store.dispatch('trainers/loadById', {id: group.trainer_id})) // todo: load related
                    }

                    if (group.hall_id) {
                        promises.push(store.dispatch('halls/loadById', {id: group.hall_id})) // todo: load related
                    }

                    promises.push(store.dispatch('clients/loadRelated', { // todo: simplify to one function
                        parent: {
                            type: 'groups',
                            id: params.id,
                        },
                        options: {
                            per_page: -1,
                        }
                    }));

                    return await Promise.all(promises);
                }),
            ]);
        },
    }
</script>

<style scoped>

</style>
