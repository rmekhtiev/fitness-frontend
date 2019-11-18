<template>
  <v-dialog v-model="dialog" :fullscreen="fullscreen" @keydown.esc="cancel">
    <v-card>
      <v-toolbar dark color="primary" class="mb-4">
        <v-btn icon dark @click="cancel()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <div class="flex-grow-1" />
        <v-toolbar-items>
          <v-btn dark text @click="save">
            Сохранить
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-select
                  v-model="form.payment_method"
                  :items="paymentMethods"
                  label="Способ оплаты"
          />
        </v-form>

        <div>К оплате:</div>
        <p class="display-1 text--primary">{{ finalPrice }} &#8381;</p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "SubscriptionSellDialog",

    props: {
      fullscreen: {
        type: Boolean,
        default: true
      },

      title: {
        type: String,
        default: ""
      },

      subscription: {
        type: Object,
        required: false,
        default: () => ({})
      },
    },

    data: () => ({
      dialog: false,

      resolve: null,
      reject: null,

      paymentMethods: [
        { value: "cash", text: "Наличные" },
        { value: "transfer", text: "Перевод на карту" },
        { value: "card", text: "Оплата картой" }
      ],

      form: {
        quantity: 1,
        price: 1,
        payment_method: 1
      }
    }),

    computed: {
      finalPrice() {
        return this.subscription.cost;
      }
    },

    created() {},

    methods: {
      open() {
        this.dialog = true;

        return new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;
        });
      },

      save() {
        this.resolve(this.form);
        this.dialog = false;
      },

      cancel() {
        this.dialog = false;
      }
    }
  };
</script>

<style scoped></style>
