<template>
  <v-card outlined class="pl-4 text-center">
    <v-flex class="font-weight-bold title">Итоговая статистика продаж</v-flex>
    <v-flex xs12 row class="font-weight-medium">
      <v-flex xs3>Итого по категории</v-flex>
      <v-flex xs3>Бар</v-flex>
      <v-flex xs3>Тренеры</v-flex>
      <v-flex xs3>Метод оплаты</v-flex>
    </v-flex>
    <v-flex xs12 row>
      <v-flex xs3>{{ items.total.cash }}</v-flex>
      <v-flex xs3>{{ items.bar.cash }}</v-flex>
      <v-flex xs3>{{ items.trainers.cash }}</v-flex>
      <v-flex xs3>Наличными</v-flex>
    </v-flex>
    <v-flex xs12 row>
      <v-flex xs3>{{ items.total.card }}</v-flex>
      <v-flex xs3>{{ items.bar.card }}</v-flex>
      <v-flex xs3>{{ items.trainers.card }}</v-flex>
      <v-flex xs3>По карте</v-flex>
    </v-flex>
    <v-flex xs12 row>
      <v-flex xs3>{{ items.total.transfer }}</v-flex>
      <v-flex xs3>{{ items.bar.transfer }}</v-flex>
      <v-flex xs3>{{ items.trainers.transfer }}</v-flex>
      <v-flex xs3>Переводом</v-flex>
    </v-flex>
    <v-flex xs12 row>
      <v-flex xs3>{{ items.total.total }}</v-flex>
      <v-flex xs3>{{ items.bar.total }}</v-flex>
      <v-flex xs3>{{ items.trainers.total }}</v-flex>
      <v-flex xs3 class="font-weight-bold">Итого</v-flex>
    </v-flex>
  </v-card>
</template>

<script>
export default {
  name: "StatsMoneyTable",
  props: {
    items: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped></style>
