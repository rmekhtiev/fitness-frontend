<template>
  <v-layout>
    <v-flex xs4 md4>
      <div style="display: flex; width: 100%">
        <div style="flex: 1 1 0%;" class="text-truncate">
          <div class="body-2 text-truncate" :title="client.full_name">
            {{ client.name }}
          </div>
          <div
            v-if="primaryHall"
            class="caption text-truncate"
            :title="primaryHall.address"
          >
            {{ primaryHall.title }}
          </div>
        </div>
      </div>
    </v-flex>

    <v-flex xs6 md4>
      <div style="display: flex; width: 100%">
        <div style="flex: 1 1 0%;" class="mt-1">
          <div class="pr-4">
            <div
              v-if="client.active_subscriptions.length > 1"
              class="body-2 green--text"
            >
              <v-icon middle color="green">
                mdi-check
              </v-icon>
              Несколько активных абонементов
            </div>
            <div v-else-if="client.active_subscriptions.length > 0">
              <div v-if="client.status === 'frozen'" class="body-2 blue--text">
                <v-icon middle color="blue">
                  mdi-snowflake
                </v-icon>
                Заморожен до
                {{
                  $moment
                    .utc(activeSubscription.frozen_till)
                    .format("DD-MM-YYYY")
                }}
              </div>
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
            <div
              v-else-if="client.inactive_subscriptions.length > 0"
              class="body-2 orange--text darken-4"
            >
              <v-icon middle color="orange">
                mdi-clock
              </v-icon>
              Будет активирован
              {{
                $moment
                  .utc(inactiveSubscription.issue_date)
                  .format("DD-MM-YYYY")
              }}
            </div>
            <div
              v-else-if="client.subscriptions_count > 0"
              class="body-2 orange--text darken-4"
            >
              <v-icon middle color="orange">
                mdi-clock
              </v-icon>
              Абонемент просрочен
            </div>
            <div v-else class="body-2 red--text">
              <v-icon middle color="red">
                error
              </v-icon>
              Абонемент отстутсвует
            </div>
          </div>
        </div>
      </div>
    </v-flex>

    <v-flex xs4 md4>
      <div style="display: flex; width: 100%">
        <div style="flex: 1 1 0%;" class="text-truncate text-right">
          <div v-if="lastVisitHistoryRecord" class="body-2">
            <div class="body-2 text-truncate">
              {{ updatedDay }}
            </div>
            <div class="caption text-truncate">
              {{ updatedTime }}
            </div>
          </div>
          <div v-else class="body-2 pt-2">
            &mdash;
          </div>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import _ from "lodash";
import client from "../../mixins/client";

export default {
  name: "ClientListItem",

  mixins: [client],

  props: {
    client: {
      type: Object,
      required: true
    }
  },

  computed: {
    primaryHall() {
      return this.$store.getters["halls/byId"]({
        id: this.client.primary_hall_id
      });
    },

    activeSubscription() {
      return this.client.active_subscriptions[
        this.client.active_subscriptions.length - 1
      ];
    },

    inactiveSubscription() {
      return _(this.client.inactive_subscriptions).last();
    },

    lastVisitHistoryRecord() {
      return this.client.last_visit_history_record;
    },

    updatedDay() {
      const date = this.$moment
        .utc(this.lastVisitHistoryRecord.datetime)
        .local();
      const now = this.$moment().local();
      if (Math.abs(date.diff(now, "days")) < 2) {
        if (date.dayOfYear() == now.dayOfYear()) {
          return "Сегодня";
        } else if (date.dayOfYear() == now.dayOfYear() - 1) {
          return "Вчера";
        }
      }
      return date.format("DD MMM");
    },

    updatedTime() {
      return this.$moment
        .utc(this.lastVisitHistoryRecord.datetime)
        .local()
        .format("HH:mm");
    },

    daysTill() {
      const date = this.$moment.utc(this.activeSubscription.valid_till);
      const days_till = this.$moment(this.activeSubscription.valid_till).diff(
        this.$moment(),
        "days"
      );
      const now = this.$moment().startOf("day");
      const sub = this.client.active_subscriptions;
      // sub = null;
      console.log(this.activeSubscription);
      if (Math.abs(date.diff(now, "days")) === 0) {
        return "Сегодня";
      } else if (Math.abs(date.diff(now, "days")) === 1) {
        return "Завтра";
      } else {
        return "Через " + days_till;
      }
    }
  }
};
</script>

<style scoped></style>
