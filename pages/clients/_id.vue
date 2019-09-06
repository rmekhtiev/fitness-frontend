<template>
  <v-layout row wrap>
    <v-flex xs12 md6 lg4 xl3>
      <client-info-card
        :client="client"
        class="mb-2 mx-auto">
      </client-info-card>
    </v-flex>

    <v-flex xs12 md6 lg4 xl3>
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
</template>

<script>
    import _ from 'lodash'

    import client from "../../mixins/client";
    import ClientInfoCard from "../../components/clients/ClientInfoCard";
    import LockerClaimListItem from "../../components/locker-claims/LockerClaimListItem";

    export default {
        components: {
            ClientInfoCard,
            LockerClaimListItem,
        },

        mixins: [
            client,
        ],

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

                    // console.log(lockerIds);

                    return Promise.all(lockerIds.map(lockerId => store.dispatch('lockers/loadById', { id: lockerId })));
                })
            ]);
        },
    }
</script>

<style scoped>

</style>
