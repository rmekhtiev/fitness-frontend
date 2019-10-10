<template>
  <v-layout>
    <v-flex xs2 md1>
      <div style="display: flex; width: 100%">
        <div style="flex: 1 1 0%;" class="text-truncate">
          <div class="body-1">{{ locker.number }}</div>
        </div>
      </div>
    </v-flex>

    <v-flex xs6 md3>
      <div style="display: flex; width: 100%">
        <div style="flex: 1 1 0%;" class="text-truncate">
          <div class="body-2 green--text" v-if="locker.free"><v-icon small color="green">check</v-icon> Свободен</div>
          <div class="pr-4" v-else>
            <v-progress-linear
              :value="durationPercent"
              color="primary"
              rounded
              height="18"
            >
              <template v-slot="{ value }">
                <span class="caption">{{ durationLeft }} дней</span>
              </template>
            </v-progress-linear>
          </div>
        </div>
      </div>
    </v-flex>

    <v-flex xs4 md3 v-if="!hideClient">
      <div style="display: flex; width: 100%">
        <div style="flex: 1 1 0%;" class="text-truncate">
          <div class="body-2 grey--text" v-if="locker.free">&mdash;</div>
          <div class="body-2" v-else :title="client.full_name"><nuxt-link :to="{name: 'clients-id', params: {id: client.id}}">{{ client.name }}</nuxt-link></div>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
    import locker from "../../mixins/locker";
    import lockerClaim from "../../mixins/locker-claim";

    export default {
        name: "LockerListItem",

        mixins: [
            locker,
            lockerClaim,
        ],

        props: {
            locker: {
                type: Object,
                required: true
            },

            hideClient: {
                type: Boolean,
                default: false,
            }
        },

        computed: {
            claim() {
                return this.locker.claim;
            },

            client() {
                return this.$store.getters['clients/byId']({ id: this.claim.client_id });
            },
        },
    }
</script>

<style scoped>

</style>
