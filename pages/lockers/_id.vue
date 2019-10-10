<template>
  <v-layout row wrap v-if="locker">
    <v-flex xs12 sm6 lg4 xl3>
      <v-card>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="headline">Шкафчик &numero;{{ locker.number }}</v-list-item-title>
            <v-list-item-subtitle :title="hall.address">{{ hall.title }}</v-list-item-subtitle>
            <div style="position: absolute; right: .5rem; top: .5rem;">
              <v-btn color="red" v-if="isHallAdmin || isOwner" @click="deleteLocker()" text small>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-flex>

    <v-flex xs12 sm6 lg4 xl3>
      <v-card class="mb-2">
        <v-card-text>
          <div class="overline mb-4">Текущая бронь</div>

          <template v-if="loading.claims">
            <v-progress-linear
              height="16"
              rounded
              color="primary"
              indeterminate
            ></v-progress-linear>
          </template>
          <template v-else>
            <div
              v-if="!claim"
              class="green--text">
              <v-icon small color="green">check</v-icon>
              Свободен
            </div>
            <v-progress-linear
              v-else
              :value="durationPercent"
              color="primary"
              height="25"
              rounded
              reactive
            >
              <template v-slot="{ value }">
                <strong>{{ durationLeft }} дней</strong>
              </template>
            </v-progress-linear>
          </template>

        </v-card-text>

        <template v-if="!loading.claims">
          <locker-claim-list-item v-if="claim" :claim="claim" is-client></locker-claim-list-item>
        </template>
      </v-card>

      <v-card>
        <v-card-text>
          <div class="overline">История броней</div>
        </v-card-text>

        <v-card-text
          v-if="loading.claims"
          class="text-center">
          <v-progress-linear
            height="16"
            rounded
            color="primary"
            indeterminate
          ></v-progress-linear>
        </v-card-text>
        <template
          v-else>

          <v-card-text
            v-if="claims.length === 0"
            class="text-center">
            <v-icon style="font-size: 4rem">mdi-inbox</v-icon>
            <br>
            Пусто
          </v-card-text>
          <template
            v-else
            v-for="(claim, index) in claims">
            <locker-claim-list-item
              is-client
              :key="'claim' + index"
              :claim="claim">
            </locker-claim-list-item>

            <v-divider
              v-if="index + 1 < claims.length"
              :key="'claim-divider' - index"
            ></v-divider>
          </template>

        </template>
      </v-card>
    </v-flex>
    <confirm ref="delete"></confirm>
  </v-layout>
</template>

<script>
    import LockerClaimListItem from "../../components/locker-claims/LockerClaimListItem";
    import locker from "../../mixins/locker";
    import lockerClaim from "../../mixins/locker-claim";
    import Confirm from "../../components/Confirm";
    import auth from "../../mixins/auth";

    export default {

        components: {
            LockerClaimListItem,
          Confirm,
        },

        mixins: [
            locker,
            lockerClaim,
            Confirm,
            auth
        ],

        data: () => ({
            loading: {
                claims: true
            }
        }),

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
                return this.locker.claim ? this.$store.getters['locker-claims/byId']({id: this.locker.claim.id}) : null
            },

            client() {
                return this.$store.getters['clients/byId']({id: this.claim.client_id})
            },
        },

        created() {
            this.loadLockerClaims();
        },

        methods: {
            loadLockerClaims() {
                this.loading.claims = true;

                let lockerClaimsFilter = {
                    locker_id: this.$route.params.id,
                };

                return this.$store.dispatch('locker-claims/loadWhere', {
                    filter: lockerClaimsFilter
                }).then(async () => {
                    let clientIds = _(this.$store.getters['locker-claims/where']({
                        filter: lockerClaimsFilter
                    })).map(claim => claim.client_id).uniq();

                    console.info('Gonna load next clients: ' + clientIds);

                    return Promise.all(clientIds.map(lockerId => this.$store.dispatch('clients/loadById', {id: lockerId}))).then(() => {
                        this.loading.claims = false;
                    });
                })
            },
            deleteLocker() {
              this.$refs.delete.open('Удалить шкафчик', 'Вы уверены? Это действие невозможно отменить', {color: 'red'}).then((confirm) => {
                if (confirm) {
                  this.$store.dispatch('lockers/delete', {id: this.locker.id});
                  this.$emit('delete');
                  this.$router.push({path: '/lockers'})
                }
              })
            },
        },

        fetch: ({store, params}) => {
            return Promise.all([
                store.dispatch('lockers/loadById', {
                    id: params.id
                }).then(async () => {
                    let locker = store.getters['lockers/byId']({id: params.id});

                    return await store.dispatch('halls/loadById', {id: locker.hall_id});
                })
            ]);
        },
    }
</script>

<style scoped>

</style>
