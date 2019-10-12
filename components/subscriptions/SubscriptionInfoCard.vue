<template>
  <v-card>
    <v-card-text>
      <div class="overline">
        Абонемент
      </div>
    </v-card-text>

    <v-row id="subscription-contents">
      <v-col>
        <v-list two-line>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="caption">
                ФИО
              </v-list-item-subtitle>
              <v-list-item-title class="text-uppercase">
                {{
                  client.name
                }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="caption">
                Информация об абонементе
              </v-list-item-subtitle
              <div v-if="client.active_subscription"
              >
              <div v-if="activeSubscription.frozen" class="body-2 blue--text">
                <v-icon middle color="blue">
                  mdi-clock
                </v-icon> Заморожен до {{ activeSubscription.frozen_till }}
              </div>
              <div v-else class="body-2">
                {{ activeSubscription.issue_date }} - {{ activeSubscription.valid_till }}
              </div>
              </div>
              <div v-else-if="client.subscriptions_count > 0" class="body-2 orange--text darken-4">
                <v-icon middle color="orange">
                  mdi-clock
                </v-icon> Абонемент просрочен
              </div>
              <div v-else class="body-2 red--text">
                <v-icon middle color="red">
                  error
                </v-icon> Абонемент отстутсвует
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col v-if="client.active_subscription" class="d-flex justify-center">
        <qrcode
          :value="JSON.stringify({ client_id: client.id })"
          :options="{ width: 200 }"
          height="200"
          width="200"
        />
      </v-col>
    </v-row>

    <v-card-actions v-if="client.active_subscription">
      <v-spacer />
      <v-btn text color="primary" @click="print">
        Печать
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import VueQrcode from "@chenfengyuan/vue-qrcode"

export default {
  name: "SubscriptionInfoCard",

  components: {
    qrcode: VueQrcode
  },

  props: {
    subscription: {
      required: true,
      type: Object
    },

    client: {
      // todo: make computed from vuex
      required: true,
      type: Object
    }
  },

  computed: {
    activeSubscription() {
      return this.$store.getters["subscriptions/byId"]({
        id: this.client.active_subscription.id
      })
    }
  },

  methods: {
    print() {
      this.$axios
        .get("/clients/" + this.client.id + "/print")
        .then(response => {
          let print = window.open(
            "",
            "",
            "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
          )
          print.document.write(response.data)

          print.document.close()
          print.focus()
          print.print()
        })

      // this.$htmlToPaper('subscription-contents');
    }
  }
}
</script>

<style scoped></style>
