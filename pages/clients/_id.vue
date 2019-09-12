<template>
  <div id="client" v-if="client">
    <v-layout row wrap>
      <v-flex xs12 sm6 lg4 xl3>
        <client-info-card
          :client="client"
          class="mb-2 mx-auto">
        </client-info-card>
        <subscription-info-card
          :subscription="subscription"
          :client="client"
          class="mb-2 mx-auto">
        </subscription-info-card>
      </v-flex>

      <v-flex xs12 sm6 lg4 xl3>
        <v-card>
          <v-card-text>
            <div class="overline">Шкафчики</div>
          </v-card-text>

          <template
            v-if="display.lockers"
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

    import SubscriptionInfoCard from "../../components/subscriptions/SubscriptionInfoCard";

    import LockerClaimListItem from "../../components/locker-claims/LockerClaimListItem";
    import LockerClaimDialog from "../../components/locker-claims/LockerClaimDialog";

    export default {
        components: {
            ClientInfoCard,
            SubscriptionInfoCard,
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

            subscription: { // todo: make computed from vuex
                id: '0defe181-4b8c-4273-85cf-1454e414a7fa',
                issue_date: '2019-09-08',
                valid_till: '2019-09-22',
            },

            loading: {
                lockers: true,
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

            lockerClaims() {
                return this.$store.getters['locker-claims/where']({
                    filter: this.lockerFilter,
                });
            },

            display() {
                return {
                    lockers: !this.loading.lockers,
                }
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
        },

        async mounted() {
            await this.loadLockerClaims();

            await this.$store.dispatch('halls/loadAll');
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
            ]);
        },
    }
</script>

<style scoped>

</style>
