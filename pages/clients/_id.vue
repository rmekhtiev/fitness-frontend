<template>
  <div :id="'client' + client.id">
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

          <template
            v-for="(claim, index) in lockerClaims">
            <locker-claim-list-item
              :key="'claim' + claim.id"
              :claim="claim">
            </locker-claim-list-item>

            <v-divider
              v-if="index + 1 < lockerClaims.length"
              :key="index"
            ></v-divider>
          </template>
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

    <locker-claim-dialog ref="lockerClaimDialog" :client="client"></locker-claim-dialog>
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
            }
        }),

        computed: {
            client() {
                return this.$store.getters['clients/byId']({id: this.$route.params.id});
            },

            lockerClaims() {
                return this.$store.getters['locker-claims/where']({
                    filter: {
                        client_id: this.$route.params.id,
                    }
                });
            },
        },

        watch: {
            fab (val) {
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
                this.$refs.lockerClaimDialog.open().then(() => {
                    this.$store.dispatch('locker-claims/loadWhere', {
                        filter: {
                            client_id: this.$route.params.id,
                        }
                    });
                });
            }
        },

        fetch: ({store, params}) => {
            let lockerClaimsFilter = {
                client_id: params.id,
            };

            return Promise.all([
                store.dispatch('clients/loadById', {
                    id: params.id
                }),

                store.dispatch('halls/loadAll'),

                store.dispatch('locker-claims/loadWhere', {
                    filter: lockerClaimsFilter
                }).then(async () => {
                    let lockerIds = _(store.getters['locker-claims/where']({
                        filter: lockerClaimsFilter
                    })).map(claim => claim.locker_id).uniq();

                    console.info('Gonna load next lockers: ' + lockerIds);

                    return Promise.all(lockerIds.map(lockerId => store.dispatch('lockers/loadById', {id: lockerId})));
                })
            ]);
        },
    }
</script>

<style scoped>

</style>
