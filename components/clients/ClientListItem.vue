<template>
    <v-layout>
      <v-flex xs6 md4>
        <div style="display: flex; width: 100%">
          <div style="flex: 1 1 0%;" class="text-truncate">
            <div class="body-2 text-truncate" :title="client.full_name">{{ client.name }}</div>
            <div
              v-if="primaryHall"
              class="caption text-truncate"
              :title="primaryHall.address">
              {{ primaryHall.title }}
            </div>
          </div>
        </div>
      </v-flex>

      <v-flex md4>
        <div style="display: flex; width: 100%">
          <div style="flex: 1 1 0%;" class="mt-1">
            <div class="pr-4">
              <div v-if="client.active_subscription">
                <div class="body-2 blue--text" v-if="activeSubscription.frozen"><v-icon middle color="blue">mdi-clock</v-icon> Заморожен до {{activeSubscription.frozen_till}}</div>
                <div v-else>
                  <v-progress-linear
                          :value="durationPercent"
                          color="primary"
                          rounded
                          height="18"
                  >
                    <template v-slot="{ value }">
                      <span class="caption">{{ daysTill }} дней</span>
                    </template>
                  </v-progress-linear>
                </div>
              </div>
              <div class="body-2 orange--text darken-4" v-else-if="client.subscriptions_count > 0"><v-icon middle color="orange">mdi-clock</v-icon> Абонемент просрочен</div>
              <div class="body-2 red--text" v-else><v-icon middle color="red">error</v-icon> Абонемент отстутсвует</div>
            </div>
          </div>
        </div>
      </v-flex>
    </v-layout>
</template>

<script>
    import client from "../../mixins/client";

    export default {
        name: "client-list-item",


        props: {
            client: {
                type: Object,
                required: true
            }
        },

        computed: {
            primaryHall() {
                return this.$store.getters['halls/byId']({id: this.client.primary_hall_id});
            },
            activeSubscription() {
              return this.$store.getters['subscriptions/byId']({id: this.client.active_subscription.id});
            },



            daysTill() {
              let date = this.$moment.utc(this.activeSubscription.valid_till);
              let days_till = this.$moment(this.activeSubscription.valid_till).diff(this.$moment(), 'days');
              let now = this.$moment().startOf('day');
              let sub = this.client.active_subscription;
              //sub = null;
              console.log(sub);
              if (Math.abs(date.diff(now, 'days')) == 0) {
                return 'Сегодня'
              } else if (Math.abs(date.diff(now, 'days')) == 1) {
                return 'Завтра'
              } else {
                return 'Через ' + days_till;
              }
            },
        },

        mixins: [
            client,
        ]
    }
</script>

<style scoped>

</style>
