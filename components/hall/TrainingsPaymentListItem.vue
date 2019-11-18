<template>
  <div>
    <v-flex xs12 row>
      <!--      <v-flex v-if="training" xs3 class="text-left">{{training.title}}</v-flex>-->
      <v-flex xs2 class="text-left">Тренер</v-flex> <!--todo-->
      <v-flex xs2 class="text-left">Клиент</v-flex> <!--todo-->
      <v-flex xs2 class="text-left">{{
        $t("methods." + trainingsPayment.method)
      }}</v-flex>
      <v-flex xs2 class="text-left">{{ trainingsPayment.quantity }}</v-flex>
      <v-flex xs2 class="text-right">{{ trainingsPayment.cost/2 }}/{{trainingsPayment.cost/2}} руб.</v-flex>
      <v-flex xs2 class="text-right"
        >{{
          trainingsPayment.cost
        }}
        руб.</v-flex
      >
    </v-flex>
  </div>
</template>

<script>
export default {
  name: "TrainingsPaymentListItem",
  props: {
    trainingsPayment: {
      type: Object,
      required: true
    }
  },
  computed: {
    // training() {
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
