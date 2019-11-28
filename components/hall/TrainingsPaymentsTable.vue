<template>
  <v-card outlined class="pl-4 text-center">
    <v-flex class="font-weight-bold title">История продаж тренировок</v-flex>
    <v-flex xs12 row class="font-weight-medium">
      <v-flex xs2 class="text-left">Тренер</v-flex>
      <v-flex xs2 class="text-left">Клиент</v-flex>
      <v-flex xs2 class="text-left">Метод оплаты</v-flex>
      <v-flex xs2 class="text-left">Количество</v-flex>
      <v-flex xs2 class="text-left">Дата начала/окончания занятий</v-flex>
      <v-flex xs2 class="text-right">Оплата тренеру</v-flex>
    </v-flex>
    <template v-for="item in trainingsPayments">
      <trainings-payment-list-item
        :trainings-payment="item"
      ></trainings-payment-list-item>
    </template>
  </v-card>
</template>

<script>
import TrainingsPaymentListItem from "./TrainingsPaymentListItem";
export default {
  name: "TrainingsPaymentsTable",
  components: { TrainingsPaymentListItem },
  props: {
    payments: {
      type: Array,
      required: true
    }
  },
  computed: {
    trainingsPayments() {
      const trainingsPayments = this.payments;
      const trainingsPaymentsByMethod = _(trainingsPayments)
        .groupBy("method")
        .value();
      const transferPayments = _(trainingsPaymentsByMethod.transfer)
        .groupBy("sellable_id")
        .map((objs, key) => ({
          sellable_id: key,
          cost: objs[0].cost,
          method: objs[0].method,
          quantity: _.sumBy(objs, "quantity")
        }))
        .value();
      const cardPayments = _(trainingsPaymentsByMethod.card)
        .groupBy("sellable_id")
        .map((objs, key) => ({
          sellable_id: key,
          cost: objs[0].cost,
          method: objs[0].method,
          quantity: _.sumBy(objs, "quantity")
        }))
        .value();
      const cashPayments = _(trainingsPaymentsByMethod.cash)
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
};
</script>

<style scoped></style>
