<template>
  <div>
    <v-flex xs12 row>
      <!--      <v-flex xs2 class="text-left" v-if="training && trainer">{{ trainer.full_name}}</v-flex>-->
      <!--      <v-flex xs2 class="text-left" v-if="training && client">{{ client.full_name }}</v-flex>-->
      <v-flex xs2 class="text-left">{{
        $t("methods." + trainingsPayment.method)
      }}</v-flex>
      <v-flex xs2 class="text-left">{{ trainingsPayment.quantity }}</v-flex>
      <v-flex xs2 class="text-right"
        >{{ trainingsPayment.cost / 2 }}/{{
          trainingsPayment.cost / 2
        }}
        руб.</v-flex
      >
      <v-flex xs2 class="text-right">{{ trainingsPayment.cost }} руб.</v-flex>
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
    //   return this.$store.getters["training-sessions/byId"]({
    //     id: this.trainingsPayment.sellable_id
    //   });
    // },
    // trainer(){
    //   return this.$store.getters["trainers/byId"]({
    //     id: this.training.trainer_id
    //   });
    // }
    // client(){
    //   return this.$store.getters["clients/byId"]({
    //     id: this.training.client_id
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
