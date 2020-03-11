<template>
  <tr>
    <td>
      <nuxt-link
        v-if="training && client"
        :to="{ name: 'clients-id', params: { id: client.id } }"
      >
        {{ client.full_name }}
      </nuxt-link>
      <v-skeleton-loader v-else-if="loading" type="table-cell" />
      <span v-else class="deleted">
        [Удалено]
      </span>
    </td>
    <td>
      <nuxt-link
        v-if="training && trainer"
        :to="{ name: 'trainers-id', params: { id: trainer.id } }"
      >
        {{ trainer.full_name }}
      </nuxt-link>
      <v-skeleton-loader v-else-if="loading" type="table-cell" />
      <span v-else class="deleted">
        [Удалено]
      </span>
    </td>
    <td>
      <template v-if="training">
        {{ formatDate(training.start_date) }} &mdash;
        {{ formatDate(training.start_date) }}
      </template>
      <v-skeleton-loader v-else-if="loading" type="table-cell" />
      <span v-else class="deleted">
        [Удалено]
      </span>
    </td>
    <td>
      {{ $t("methods." + trainingsPayment.method) }}
    </td>
    <td>{{ $moment(trainingsPayment.updated_at).format("ll") }}</td>
    <td class="text-right">{{ trainingsPayment.total }} &#8381;</td>
  </tr>
</template>

<script>
export default {
  name: "TrainingsPaymentListItem",
  props: {
    trainingsPayment: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
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
      return this.$moment.utc(date).format("LL");
    }
  }
};
</script>

<style scoped></style>
