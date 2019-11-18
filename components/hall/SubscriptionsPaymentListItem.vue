<template>
  <div>
    <v-flex xs12 row>
      <!--      <v-flex v-if="subscription" xs3 class="text-left"></v-flex>-->
      <v-flex xs3 class="text-left">Клиент</v-flex> <!--todo-->
      <v-flex xs3 class="text-left">10.10.2019/10.11.2019</v-flex> <!--todo-->
      <v-flex xs2 class="text-left">Групповой</v-flex> <!--todo-->
      <v-flex xs2 class="text-left">{{ $t("methods." + subscriptionsPayment.method) }}</v-flex>
      <v-flex xs2 class="text-right"
        >{{
          calculateTotal(
            subscriptionsPayment.cost,
            subscriptionsPayment.quantity
          )
        }}
        руб.</v-flex
      >
    </v-flex>
  </div>
</template>

<script>
export default {
  name: "SubscriptionsPaymentListItem",
  props: {
    subscriptionsPayment: {
      type: Object,
      required: true
    }
  },
  computed: {
    // subscription() {
    //   return this.$store.getters["trainings/byId"]({
    //     id: this.trainingsPayment.sellable_id
    //   });
    // }
  },
  methods: {
    calculateTotal(cost, quantity) {
      const floatCost = parseFloat(cost);
      return floatCost * quantity;
    }
  }
};
</script>

<style scoped></style>
