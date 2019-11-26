<template>
  <v-card>
    <v-card-text>
      <div v-if="isActive" class="overline">
        Активный абонемент
      </div>
      <div v-else class="overline">
        Неактивированный абонемент
      </div>
    </v-card-text>

    <v-list two-line>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle class="caption">
            Тип абонемента
          </v-list-item-subtitle>
          <v-list-item-title v-if="subscription.subscriable_id == null">
            Абонемент в зал
          </v-list-item-title>
          <v-list-item-title
            v-else-if="subscription.subscriable_type === 'groups'"
          >
            <template v-if="group">Абонемент группу {{ group.title }}</template>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle class="caption">
            Информация об абонементе
          </v-list-item-subtitle>
          <div v-if="isActive">
            <div
              v-if="this.subscription.frozen_till > this.$moment().format('ll')"
              class="body-2 blue--text"
            >
              <div>
                Заморожен с
                {{
                  $moment
                    .utc(this.subscription.frozen_start)
                    .format("DD-MM-YYYY")
                }}
                - по
                {{
                  $moment
                    .utc(this.subscription.frozen_till)
                    .format("DD-MM-YYYY")
                }}
              </div>
              <div v-if="this.subscription.frozen_start <= this.$moment()">
                Дней заморозки осталось {{ diff }}
              </div>
            </div>
            <div class="body-2">
              Действителен с
              {{
                $moment.utc(this.subscription.issue_date).format("DD-MM-YYYY")
              }}
              &mdash; по
              {{
                $moment.utc(this.subscription.valid_till).format("DD-MM-YYYY")
              }}
            </div>
          </div>
          <div v-else-if="!isActive" class="body-2 orange--text darken-4">
            <v-icon middle color="orange">
              mdi-clock
            </v-icon>
            Будет активирован
            {{ $moment.utc(this.subscription.issue_date).format("DD-MM-YYYY") }}
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <!--      <v-col v-if="client.active_subscriptions" class="d-flex justify-center">-->
    <!--        <qrcode-->
    <!--          :value="JSON.stringify({ client_id: client.id })"-->
    <!--          :options="{ width: 200 }"-->
    <!--          height="200"-->
    <!--          width="200"-->
    <!--        />-->
    <!--      </v-col>-->

    <v-card-actions>
      <v-spacer />

      <v-btn
        v-if="
          this.subscription.frozen_till < this.$moment().format('ll') ||
            (this.subscription.frozen_till == null && this.subscription.sold == true)
        "
        @click="freezeSubscription()"
        color="primary"
        text
        small
      >
        <v-icon left>mdi-snowflake</v-icon>
        Заморозить
      </v-btn>
      <v-btn
        v-if="this.subscription.frozen_till > this.$moment().format('ll')"
        @click="deleteFreeze()"
        color="red"
        text
      >
        Отменить заморозку
      </v-btn>

      <v-btn
        v-if="this.subscription.sold == false"
        @click="sellItem()"
        color="red"
        text
      >
        Оформить продажу
      </v-btn>

      <v-btn @click="updateSubscription()" color="primary" text small>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-card-actions>
    <subscription-dialog
      ref="subscriptionDialog"
      :subscription="subscription"
      :client="client"
      title="Правка абонемента"
      is-edit
    />
    <subscription-freeze-dialog
      ref="subscriptionFreezeDialog"
      :subscription="subscription"
      title="Заморозка абонемента"
    />
    <subscription-sell-dialog
      ref="sellDialog"
      :subscription="subscription"
      :title="'Продажа'"
    />
    <confirm ref="deleteFreeze" />
  </v-card>
</template>

<script>
import VueQrcode from "@chenfengyuan/vue-qrcode";
import Confirm from "../Confirm";
import SubscriptionDialog from "./SubscriptionDialog";
import SubscriptionFreezeDialog from "./SubscriptionFreezeDialog";
import SubscriptionSellDialog from "./SubscriptionSellDialog";

export default {
  name: "SubscriptionInfoCard",

  components: {
    SubscriptionDialog,
    SubscriptionFreezeDialog,
    SubscriptionSellDialog,
    qrcode: VueQrcode,
    Confirm
  },

  props: {
    client: {
      // todo: make computed from vuex
      required: true,
      type: Object
    },
    subscription: {
      required: true,
      type: Object
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    diff() {
      const diff =
        this.$moment(this.subscription.frozen_till).diff(
          this.$moment(),
          "days"
        ) + 1;
      return diff;
    },
    group() {
      return this.$store.getters["groups/byId"]({
        id: this.subscription.subscriable_id
      });
    }
  },

  methods: {
    updateSubscription() {
      this.$refs.subscriptionDialog.open().then(form => {
        this.$axios
          .patch("subscriptions/" + this.subscription.id, form)
          .then(async response => {
            await this.$store.dispatch("subscriptions/loadById", {
              id: response.data.data.id
            });
          });

        this.$emit("update");
      });
    },

    sellItem() {
      this.$refs.sellDialog.open().then(form => {
        this.$axios
          .$post("subscriptions/" + this.subscription.id + "/sell", form)
          .then(() => {
            this.$store.dispatch("subscriptions/loadById", {
              id: this.subscription.id
            });

            this.$emit("update");
          });
      });
    },

    freezeSubscription() {
      this.$refs.subscriptionFreezeDialog.open().then(form => {
        this.$axios
          .patch("subscriptions/" + this.subscription.id, form)
          .then(async response => {
            await this.$store.dispatch("subscriptions/loadById", {
              id: response.data.data.id
            });
          });

        this.$emit("update");
      });
    },

    deleteFreeze() {
      const diff =
        this.$moment(this.subscription.frozen_till).diff(
          this.$moment(),
          "days"
        ) + 1;
      const validTill = this.$moment(this.subscription.valid_till)
        .add(-diff, "day")
        .format("YYYY-MM-DD");
      this.$refs.deleteFreeze
        .open(
          "Отменить заморозку",
          "Вы уверены? Это действие невозможно отменить",
          {
            color: "red"
          }
        )
        .then(confirm => {
          if (confirm) {
            this.$axios
              .patch("subscriptions/" + this.subscription.id, {
                frozen_start: null,
                frozen_till: null,
                valid_till: validTill
              })
              .then(async response => {
                await this.$store.dispatch("subscriptions/loadById", {
                  id: response.data.data.id
                });
              });
            this.$emit("update");
          }
        });
    }
  }
};
</script>

<style scoped></style>
