<template>
  <div>
    <v-flex xs12 row>
      <v-flex xs3 v-if="barItem">{{barItem.title}}</v-flex>
      <v-flex xs3>{{ $t("methods." + barPayment.method) }}</v-flex>
      <v-flex xs2>{{ barPayment.quantity }}</v-flex>
      <v-flex xs2>{{ barPayment.cost }} руб.</v-flex>
      <v-flex xs2
        >{{ calculateTotal(barPayment.cost, barPayment.quantity) }} руб.</v-flex
      >
    </v-flex>
  </div>
</template>

<script>
export default {
  name: "BarPaymentListItem",
  props: {
    barPayment: {
      type: Object,
      required: true
    }
  },
  computed: {
    barItem() {
      return this.$store.getters["bar-items/byId"]({
        id: this.barPayment.sellable_id
      });
    }
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
