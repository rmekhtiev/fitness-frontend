<template>
  <div id="client" v-if="client">
    <v-layout row wrap>
      <v-flex xs12 sm6 lg4 xl3>
        <client-info-card
          :client="client"
          class="mb-2 mx-auto">
        </client-info-card>
      </v-flex>

      <v-flex xs12 sm6 lg4 xl3>
        <v-card>
          <v-card-text>
            <div class="overline">Шкафчики</div>
          </v-card-text>

          <v-list
            v-if="!loading.lockers">
            <template
              v-for="(claim, index) in lockerClaims">
              <locker-claim-list-item
                :key="'claim' + index"
                :claim="claim">
              </locker-claim-list-item>

              <v-divider
                v-if="index + 1 < lockerClaims.length"
                :key="'claim-divider' + index"
              ></v-divider>
            </template>
          </v-list>
          <v-card-text
            v-else
            class="text-center">
            <v-progress-linear
              height="16"
              rounded
              color="primary"
              indeterminate
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm6 lg4 xl3>
        <v-card>
          <v-card-text>
            <div class="overline">Группы</div>
          </v-card-text>

          <v-list
            v-if="!loading.groups">
            <template
              v-for="(group, index) in groups">
              <v-list-item
                :to="{name: 'groups-id', params: {id: group.id}}"
                :key="'group-' + index">
                <v-list-item-content>
                  <v-list-item-title>{{ group.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-divider
                v-if="index + 1 < lockerClaims.length"
                :key="'claim-divider' + index"
              ></v-divider>
            </template>
          </v-list>
          <v-card-text
            v-else
            class="text-center">
            <v-progress-linear
              height="16"
              rounded
              color="primary"
              indeterminate
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-flex>

    </v-layout>

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
        left
        :value="tooltips">
        <template v-slot:activator="{ on }">
          <v-btn fab dark small color="green" @click.native="openLockerClaimDialog">
            <v-icon>mdi-locker</v-icon>
          </v-btn>
        </template>
        <span>Шкафчик</span>
      </v-tooltip>
    </v-speed-dial>

    <locker-claim-dialog ref="lockerClaimDialog" title="Новая бронь шкафчика" :client="client"></locker-claim-dialog>
  </div>
</template>

<script>
    import _ from 'lodash'

    import client from "../../mixins/client";
    import ClientInfoCard from "../../components/clients/ClientInfoCard";
    import LockerClaimListItem from "../../components/locker-claims/LockerClaimListItem";
    import LockerClaimDialog from "../../components/locker-claims/LockerClaimDialog";

    export default {
        components: {
            ClientInfoCard,
            LockerClaimListItem,
            LockerClaimDialog,
        },

        mixins: [
            client,
        ],

        data: () => ({
            fab: false,
            tooltips: false,
            tooltipsDisabled: false,

            dialogs: {
                lockerClaim: false,
            },

            loading: {
                lockers: true,
                groups: true,
            }
        }),

        computed: {
            client() {
                return this.$store.getters['clients/byId']({id: this.$route.params.id});
            },

            lockerFilter() {
                return {
                    client_id: this.$route.params.id,
                    after: this.$moment().format('YYYY-MM-DD')
                };
            },

            groupFilter() {
                return {
                    id: this.groupsIds,
                };
            },

            lockerClaims() {
                return this.$store.getters['locker-claims/where']({
                    filter: this.lockerFilter,
                });
            },

            groups() {
                return this.$store.getters['groups/where']({
                    filter: this.groupFilter,
                });
            }
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
            openLockerClaimDialog() {
                this.$refs.lockerClaimDialog.open().then((form) => {
                    this.$axios.post('locker-claims', form)
                        .then(async response => {
                            await this.$store.dispatch('locker-claims/loadById', {id: response.data.data.id});
                        });

                    this.$store.dispatch('locker-claims/loadWhere', {
                        filter: this.lockerFilter
                    });
                });
            },

            loadLockerClaims() {
                this.loading.lockers = true;

                return this.$store.dispatch('locker-claims/loadWhere', {
                    filter: this.lockerFilter,
                }).then(() => {
                    let lockerIds = _(this.$store.getters['locker-claims/where']({
                        filter: this.lockerFilter
                    })).map(claim => claim.locker_id).uniq();

                    console.info('Gonna load next lockers: ' + lockerIds);

                    return Promise.all(lockerIds.map(lockerId => this.$store.dispatch('lockers/loadById', {id: lockerId}))).then(() => {
                        this.loading.lockers = false;
                    });
                })
            },

            loadGroups() {
                this.loading.groups = true;

                return this.$store.dispatch('groups/loadWhere', {
                    filter: this.groupFilter,
                }).then(() => {
                    this.loading.groups = false;
                })
            }
        },

        async mounted() {
            await Promise.all([
                this.loadLockerClaims(),
                this.loadGroups(),
            ]);
        },

        fetch: ({store, params, $moment, ...rest}) => {
            let lockerClaimsFilter = {
                client_id: params.id,
                after: $moment().format('YYYY-MM-DD')
            };

            return Promise.all([
                store.dispatch('clients/loadById', {
                    id: params.id
                }),
                store.dispatch('halls/loadAll'),
            ]);
        },
    }
</script>

<style scoped>

</style>
