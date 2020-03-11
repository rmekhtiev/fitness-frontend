<template>
  <tr>
    <td>
      <template v-if="barItem">
        {{ barItem.title }}
      </template>
      <v-skeleton-loader v-else-if="loading" type="table-cell" />
      <span v-else class="deleted">
        [Удалено]
      </span>
    </td>
    <td>
      {{ $t("methods." + barPayment.method) }}
    </td>
    <td>{{ $moment(barPayment.updated_at).format('ll')}}</td>
    <td class="text-right">{{ barPayment.quantity }}</td>
    <td class="text-right">{{ barPayment.cost }} &#8381;</td>
    <td class="text-right">{{ barPayment.total }} &#8381;</td>
  </tr>
</template>

<script>
export default {
  name: "BarPaymentListItem",
  props: {
    barPayment: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
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
