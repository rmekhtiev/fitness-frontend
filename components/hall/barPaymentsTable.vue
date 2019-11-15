<template>
  <v-card outlined class="pl-4 text-center">
    <v-flex class="font-weight-bold title">История продаж бара</v-flex>
    <v-flex xs12 row class="font-weight-medium">
      <v-flex xs3 class="text-left">Наименование</v-flex>
      <v-flex xs3>Метод оплаты</v-flex>
      <v-flex xs2>Количество</v-flex>
      <v-flex xs2 class="text-right">Цена за ед.</v-flex>
      <v-flex xs2 class="text-right">Итого</v-flex>
    </v-flex>
    <template v-for="item in barPayments">
      <bar-payment-list-item :bar-payment="item"></bar-payment-list-item>
    </template>
  </v-card>
</template>

<script>
import BarPaymentListItem from "../../components/hall/BarPaymentListItem";
export default {
  name: "BarPaymentsTable",
  components: {
    BarPaymentListItem
  },
  props: {
    payments: {
      type: Array,
      required: true
    }
  },

  computed: {
    barPayments() {
      const barPayments = this.payments;
      const barPaymentsByMethod = _(barPayments)
        .groupBy("method")
        .value();
      const transferPayments = _(barPaymentsByMethod.transfer)
        .groupBy("sellable_id")
        .map((objs, key) => ({
          sellable_id: key,
          cost: objs[0].cost,
          method: objs[0].method,
          quantity: _.sumBy(objs, "quantity")
        }))
        .value();
      const cardPayments = _(barPaymentsByMethod.card)
        .groupBy("sellable_id")
        .map((objs, key) => ({
          sellable_id: key,
          cost: objs[0].cost,
          method: objs[0].method,
          quantity: _.sumBy(objs, "quantity")
        }))
        .value();
      const cashPayments = _(barPaymentsByMethod.cash)
        .groupBy("sellable_id")
        .map((objs, key) => ({
          sellable_id: key,
          cost: objs[0].cost,
          method: objs[0].method,
          quantity: _.sumBy(objs, "quantity")
        }))
        .value();
      const result = _.concat(cashPayments, cardPayments, transferPayments);
      console.log(result);

      return result;
    }
  },
  methods: {}
};
</script>

<style scoped></style>
