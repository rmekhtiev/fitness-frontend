<template>
  <div v-if="claim">
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

      <v-list-item-action>
        <v-menu bottom left>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              v-on="on"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list dense flat>
            <v-list-item @click="updateClaim()" v-if="!past">
              <v-list-item-icon>
                <v-icon>mdi-pencil</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="pr-6">
                <v-list-item-title>Редактировать</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="deleteClaim()">
              <v-list-item-icon>
                <v-icon>mdi-delete</v-icon>
              </v-list-item-icon>
              <v-list-item-content class="pr-6">
                <v-list-item-title>Удалить</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list-item-action>
    </v-list-item>

    <locker-claim-dialog ref="edit" :claim="claim" title="Редактирование брони шкафчика" is-edit></locker-claim-dialog>
    <confirm ref="delete"></confirm>
  </div>
</template>

<script>
    import lockerClaim from '../../mixins/locker-claim'

    import Confirm from "../Confirm";
    import LockerClaimDialog from "./LockerClaimDialog";

    export default {
        name: "LockerClaimListItem",

        components: {
            Confirm,
            LockerClaimDialog,
        },

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
        },

        methods: {
            deleteClaim() {
                this.$refs.delete.open('Удалить бронь', 'Вы уверены?', {color: 'red'}).then((confirm) => {
                    if (confirm) {
                        let lockerId = this.claim.locker_id;

                        this.$store.dispatch('locker-claims/delete', {id: this.claim.id});
                        this.$store.dispatch('lockers/loadById', {id: lockerId});

                        this.$emit('delete');
                    }
                })
            },

            updateClaim() {
                this.$refs.edit.open().then((form) => {
                    this.$axios.patch('locker-claims/' + this.claim.id, form)
                        .then(async response => {
                            await this.$store.dispatch('locker-claims/loadById', {id: response.data.data.id});
                        });

                    this.$emit('update');
                });
            }
        }
    }
</script>

<style scoped>

</style>
