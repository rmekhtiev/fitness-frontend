<template>
  <div>
    <v-flex xs12 row>
      <v-flex v-if="subscription && client" xs3 class="text-left"
        >{{ client.first_name }} {{ client.last_name }}</v-flex
      >
      <v-flex v-if="subscription" xs3 class="text-left"
        >{{ formatDate(subscription.issue_date) }}/{{
          formatDate(subscription.valid_till)
        }}</v-flex
      >
      <v-flex
        v-if="subscription && group && group !== 'Зал'"
        xs2
        class="text-left"
        >В группу {{ group.title }}</v-flex
      >
      <v-flex v-else xs2 class="text-left">В зал</v-flex>
      <v-flex xs2 class="text-left">{{
        $t("methods." + subscriptionsPayment.method)
      }}</v-flex>
      <v-flex xs2 class="text-right"
        >{{ subscriptionsPayment.cost }} руб.</v-flex
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
    subscription() {
      return this.$store.getters["subscriptions/byId"]({
        id: this.subscriptionsPayment.sellable_id
      });
    },
    client() {
      return this.$store.getters["clients/byId"]({
        id: this.subscription.client_id
      });
    },
    group() {
      return this.subscription.subscriable_id !== null
        ? this.$store.getters["groups/byId"]({
            id: this.subscription.subscriable_id
          })
        : "Зал";
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
