<template>
  <v-card>

    <v-card-text>
      <div v-if="isActive" class="overline">
        Активный абонемент
      </div>
      <div v-else class="overline">
        Неактивированный абонемент
      </div>


          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle class="caption">
                  Тип абонемента
                </v-list-item-subtitle>
                <div v-if="this.subscription.subscriable_id == null">
                    Абонемент в зал
                </div>
                <div v-else>
                    <v-list-item :to="{ name: 'groups-id', params: { id: group.id } }" style="padding: 0">
                      <v-list-item-content>
                        Абонемент группу {{ group.title }}
                      </v-list-item-content>
                    </v-list-item>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle class="caption">
                  Информация об абонементе
                </v-list-item-subtitle>
                <div v-if=isActive>
                  <div v-if="this.subscription.frozen_till > this.$moment().format('ll')" class="body-2 blue--text">
                    <div>
                      Заморожен с {{ $moment.utc(this.subscription.frozen_start).format('DD-MM-YYYY') }} - по {{ $moment.utc(this.subscription.frozen_till).format('DD-MM-YYYY') }}
                    </div>
                    <div v-if="this.subscription.frozen_start <= this.$moment()">
                      Дней заморозки осталось {{diff}}
                    </div>
                  </div>
                  <div class="body-2">
                    Действителен
                    с {{ $moment.utc(this.subscription.issue_date).format('DD-MM-YYYY') }} &mdash; по {{ $moment.utc(this.subscription.valid_till).format('DD-MM-YYYY') }}
                  </div>
                </div>
                <div v-else-if=!isActive
                     class="body-2 orange--text darken-4"
                >
                  <v-icon middle color="orange">
                    mdi-clock
                  </v-icon>
                  Будет активирован {{ $moment.utc(this.subscription.issue_date).format('DD-MM-YYYY') }}
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
    </v-card-text>



    <v-card-actions>
      <v-spacer />


      <v-btn
              v-if="this.subscription.frozen_till < this.$moment().format('ll') || this.subscription.frozen_till == null && this.subscription.sold == true"
              color="primary"
              text
              small
              @click="freezeSubscription()"
      >
        <v-icon left>mdi-snowflake</v-icon>
        Заморозить
      </v-btn>
      <v-btn
              v-if="this.subscription.frozen_till > this.$moment().format('ll')"
              color="red"
              text
              @click="deleteFreeze()"
      >
        Отменить заморозку
      </v-btn>

      <v-btn v-if="this.subscription.sold == false"
             color="red"
             text
             @click="sellItem()"
      >
        Оформить продажу
      </v-btn>

      <v-btn
              color="primary"
              text
              small
              @click="updateSubscription()"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>


    </v-card-actions>
    <subscription-dialog
            ref="subscriptionDialog"
            title="Правка абонемента"
            :subscription="subscription"
            is-edit
    />
    <subscription-freeze-dialog
                         ref="subscriptionFreezeDialog"
                         title="Заморозка абонемента"
                         :subscription="subscription"
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
import SubscriptionDialog from "./SubscriptionDialog";
import SubscriptionFreezeDialog from "./SubscriptionFreezeDialog";
import SubscriptionSellDialog from "./SubscriptionSellDialog";
import Confirm from "../Confirm";

export default {
  name: "SubscriptionInfoCard",

  components: {
    SubscriptionDialog,
    SubscriptionFreezeDialog,
    SubscriptionSellDialog,
    qrcode: VueQrcode,
    Confirm,
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
      let diff = this.$moment(this.subscription.frozen_till).diff(
              this.$moment(),
              "days"
      )+1;
      return diff
    },
    group() {
      return this.$store.getters['groups/byId']({
        id:this.subscription.subscriable_id
      });
    },
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
      })
    },

    deleteFreeze() {
      let diff = this.$moment(this.subscription.frozen_till).diff(
              this.$moment(),
              "days"
      ) + 1;
      let validTill = this.$moment(this.subscription.valid_till).add(-diff, "day").format("YYYY-MM-DD")
      this.$refs.deleteFreeze.open("Отменить заморозку", "Вы уверены? Это действие невозможно отменить", {
                color: "red"
              })
              .then(confirm => {
                if (confirm) {
                  this.$axios.patch("subscriptions/" + this.subscription.id, {
                    frozen_start: null,
                    frozen_till: null,
                    valid_till: validTill,
                  }).then(async response => {
                    await this.$store.dispatch("subscriptions/loadById", {
                      id: response.data.data.id,
                    });
                  });
                  this.$emit("update");
                }
              });
    },
  }
};
</script>

<style scoped></style>
