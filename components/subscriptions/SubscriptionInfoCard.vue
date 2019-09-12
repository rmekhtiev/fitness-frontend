<template>
  <v-card>
    <v-card-text>
      <div class="overline">Абонемент</div>
    </v-card-text>

    <v-row>
      <v-col>
        <v-list two-line>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="caption">ФИО</v-list-item-subtitle>
              <v-list-item-title class="text-uppercase">{{ client.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="caption">Действителен</v-list-item-subtitle>
              <v-list-item-title class="text-uppercase">{{ $moment(subscription.issue_date).format('ll') }} &mdash; {{
                $moment(subscription.valid_till).format('ll') }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col class="d-flex justify-center">
        <qrcode :value="JSON.stringify({client_id: client.id})"
                :options="{ width: 200 }"
                height="200"
                width="200"></qrcode>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
    import VueQrcode from '@chenfengyuan/vue-qrcode';

    export default {
        name: "SubscriptionInfoCard",

        components: {
            'qrcode': VueQrcode
        },

        props: {
            subscription: {
                required: true,
                type: Object,
            },

            client: { // todo: make computed from vuex
                required: true,
                type: Object,
            },
        }
    }
</script>

<style scoped>

</style>
