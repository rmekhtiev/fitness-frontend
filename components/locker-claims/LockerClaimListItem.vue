<template>
  <v-list-item two-line>
    <v-list-item-content>
      <v-list-item-title v-if="!isClient">
        <nuxt-link :to="{ name: 'lockers-id', params: {id: locker.id } }">&numero;{{ locker.number }}</nuxt-link>
        <span :title="hall.address">({{ hall.title }})</span>
      </v-list-item-title>
      <v-list-item-title v-else>
        <nuxt-link :to="{ name: 'clients-id', params: {id: client.id } }">{{ client.name}}</nuxt-link>
      </v-list-item-title>

      <v-list-item-subtitle
        v-if="past">
        {{ $moment(claim.claim_start).format('ll') }} &mdash; {{ $moment(claim.claim_end).format('ll') }}
      </v-list-item-subtitle>
      <v-list-item-subtitle
        v-else-if="future"
        :title="$moment(claim.claim_start).format('ll') + ' - ' + $moment(claim.claim_end).format('ll')">
        <strong>{{ $moment(this.claim.claim_start).diff($moment(), 'days') }} дней</strong> до начала брони
      </v-list-item-subtitle>
      <v-list-item-subtitle
        v-else
        :title="$moment(claim.claim_start).format('ll') + ' - ' + $moment(claim.claim_end).format('ll')">
        <strong>{{ durationLeft }} дней</strong> до окончания брони
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
    import lockerClaim from '../../mixins/locker-claim'

    export default {
        name: "LockerClaimListItem",

        mixins: [
            lockerClaim,
        ],

        props: {
            claim: {
                type: Object,
            },

            isClient: {
                type: Boolean,
                default: false
            }
        },

        computed: {
            locker() {
                return this.$store.getters['lockers/byId']({id: this.claim.locker_id})
            },

            hall() {
                return this.$store.getters['halls/byId']({id: this.locker.hall_id})
            },

            client() {
                return this.$store.getters['clients/byId']({id: this.claim.client_id})
            },
        }
    }
</script>

<style scoped>

</style>
