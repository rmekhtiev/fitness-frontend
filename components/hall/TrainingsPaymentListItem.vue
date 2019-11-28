<template>
  <div>
    <v-flex xs12 row>
      <v-flex v-if="training && trainer" xs2 class="text-left">{{
        trainer.full_name
      }}</v-flex>
      <v-flex v-if="training && client" xs2 class="text-left">{{
        client.full_name
      }}</v-flex>
      <v-flex xs2 class="text-left">{{
        $t("methods." + trainingsPayment.method)
      }}</v-flex>
      <v-flex v-if="training" xs3 class="text-left">
        {{ formatDate(training.start_date) }}/{{
          formatDate(training.end_date)
        }}</v-flex
      >
      <v-flex xs3 class="text-right">{{ trainingsPayment.cost }} руб.</v-flex>
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
    training() {
      return this.$store.getters["training-sessions/byId"]({
        id: this.trainingsPayment.sellable_id
      });
    },
    trainer() {
      return this.$store.getters["trainers/byId"]({
        id: this.training.trainer_id
      });
    },
    client() {
      return this.$store.getters["clients/byId"]({
        id: this.training.client_id
      });
    }
  },
  methods: {
    calculateTotal(cost, quantity) {
      const floatCost = parseFloat(cost);
      return floatCost * quantity;
    },
    formatDate(date) {
      return this.$moment.utc(date).format("D.M.YYYY");
    }
  }
};
</script>

<style scoped></style>
