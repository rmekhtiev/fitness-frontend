<template>
  <v-list-item two-line>
    <v-list-item-content>
      <v-list-item-title>
        <nuxt-link :to="{ name: 'locker-id' }">&numero;{{ locker.number }}</nuxt-link> <span :title="hall.address">({{ hall.title }})</span>
      </v-list-item-title>
      <v-list-item-subtitle v-if="past">{{ $moment(claim.claim_start).format('ll') }} &mdash; {{ $moment(claim.claim_end).format('ll') }}</v-list-item-subtitle>
      <v-list-item-subtitle v-else :title="$moment(claim.claim_start).format('ll') + ' - ' + $moment(claim.claim_end).format('ll')"><strong>{{ durationLeft }} дней</strong> до окончания брони</v-list-item-subtitle>
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
                required: true,
            }
        },

        computed: {
            locker() {
                return this.$store.getters['lockers/byId']({ id: this.claim.locker_id })
            },

            hall() {
                return this.$store.getters['halls/byId']({ id: this.locker.hall_id })
            }
        }
    }
</script>

<style scoped>

</style>
