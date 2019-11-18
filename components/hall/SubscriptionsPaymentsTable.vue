<template>
  <v-card outlined class="pl-4 text-center">
    <v-flex class="font-weight-bold title">История продаж абонементов</v-flex>
    <v-flex xs12 row class="font-weight-medium">
      <v-flex xs3 class="text-left">Клиент</v-flex>
      <v-flex xs3 class="text-left">Дата начала/окончания</v-flex>
      <v-flex xs2 class="text-left">Тип абонимента</v-flex>
      <v-flex xs2 class="text-left">Метод оплаты</v-flex>
      <v-flex xs2 class="text-right">Итого</v-flex>
    </v-flex>
    <template v-for="item in subscriptionsPayments">
      <subscriptions-payment-list-item
        :subscriptions-payment="item"
      ></subscriptions-payment-list-item>
    </template>
  </v-card>
</template>

<script>
import SubscriptionsPaymentListItem from "./SubscriptionsPaymentListItem";
export default {
  name: "SubscriptionsPaymentsTable",
  components: { SubscriptionsPaymentListItem },
  props: {
    payments: {
      type: Array,
      required: true
    }
  },
  computed: {
    subscriptionsPayments() {
      const subscriptionsPayments = this.payments;
      const subscriptionsPaymentsByMethod = _(subscriptionsPayments)
        .groupBy("method")
        .value();
      const transferPayments = _(subscriptionsPaymentsByMethod.transfer)
        .groupBy("sellable_id")
        .map((objs, key) => ({
          sellable_id: key,
          cost: objs[0].cost,
          method: objs[0].method,
          quantity: _.sumBy(objs, "quantity")
        }))
        .value();
      const cardPayments = _(subscriptionsPaymentsByMethod.card)
        .groupBy("sellable_id")
        .map((objs, key) => ({
          sellable_id: key,
          cost: objs[0].cost,
          method: objs[0].method,
          quantity: _.sumBy(objs, "quantity")
        }))
        .value();
      const cashPayments = _(subscriptionsPaymentsByMethod.cash)
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
  }
};
</script>

<style scoped></style>
