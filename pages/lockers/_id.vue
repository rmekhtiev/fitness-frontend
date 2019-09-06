<template>
  <v-layout row wrap>
    <v-flex xs12 md6 lg4 xl3>
      <v-card>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="headline">Шкафчик &numero;{{ locker.number }}</v-list-item-title>
            <v-list-item-subtitle :title="hall.address">{{ hall.title }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-flex>

    <v-flex xs12 md6 lg4 xl3>
      <v-card class="mb-2">
        <v-card-text>
          <div class="overline mb-4">Текущая бронь</div>

          <div
            v-if="locker.free"
          class="green--text">
            <v-icon small color="green">check</v-icon> Свободен
          </div>
          <v-progress-linear
            v-else
            :value="durationPercent"
            color="blue-grey"
            height="25"
            rounded
            reactive
          >
            <template v-slot="{ value }">
              <strong>{{ durationLeft }} дней</strong>
            </template>
          </v-progress-linear>
        </v-card-text>

        <v-list-item v-if="!locker.free">
          <v-list-item-content>
            <v-list-item-title :title="client.full_name"><nuxt-link :to="{name: 'clients-id', params: {id: client.id}}">{{ client.name }}</nuxt-link></v-list-item-title>
            <v-list-item-subtitle>{{ $moment(claim.claim_start).format('ll') }} &mdash; {{ $moment(claim.claim_end).format('ll') }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>

      <v-card>
        <v-card-text>
          <div class="overline">История броней</div>
        </v-card-text>

        <template
          v-for="(claim, index) in claims">
          <locker-claim-list-item
            :key="'claim' + claim.id"
            :claim="claim"
            is-client>
          </locker-claim-list-item>

          <v-divider
            v-if="index + 1 < claims.length"
            :key="index"
          ></v-divider>
        </template>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
    import LockerClaimListItem from "../../components/locker-claims/LockerClaimListItem";
    import locker from "../../mixins/locker";
    import lockerClaim from "../../mixins/locker-claim";

    export default {

        components: {
            LockerClaimListItem,
        },

        mixins: [
            locker,
            lockerClaim,
        ],

        computed: {
            locker() {
                return this.$store.getters['lockers/byId']({id: this.$route.params.id});
            },

            hall() {
                return this.$store.getters['halls/byId']({id: this.locker.hall_id});
            },

            claims() {
                return this.$store.getters['locker-claims/where']({filter: {locker_id: this.locker.id}})
            },

            claim() {
                return this.$store.getters['locker-claims/byId']({id: this.locker.claim.id})
            },

            client() {
                return this.$store.getters['clients/byId']({id: this.claim.client_id})
            }
        },

        fetch: ({store, params}) => {
            let lockerClaimsFilter = {
                locker_id: params.id,
            };

            return Promise.all([
                store.dispatch('lockers/loadById', {
                    id: params.id
                }).then(async () => {
                    let locker = store.getters['lockers/byId']({id: params.id});

                    return await store.dispatch('halls/loadById', { id: locker.hall_id});
                }),

                store.dispatch('locker-claims/loadWhere', {
                    filter: lockerClaimsFilter
                }).then(async () => {
                    let clientIds = _(store.getters['locker-claims/where']({
                        filter: lockerClaimsFilter
                    })).map(claim => claim.client_id).uniq();

                    console.info('Gonna load next clients: ' + clientIds);

                    return Promise.all(clientIds.map(lockerId => store.dispatch('clients/loadById', { id: lockerId })));
                })
            ]);
        },
    }
</script>

<style scoped>

</style>
