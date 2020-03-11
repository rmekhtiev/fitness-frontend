<template>
  <tr>
    <td>
      <nuxt-link
        v-if="subscription && client"
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
      <template v-if="subscription">
        {{ formatDate(subscription.issue_date) }} &mdash;
        {{ formatDate(subscription.valid_till) }}
      </template>
      <v-skeleton-loader v-else-if="loading" type="table-cell" />
      <span v-else class="deleted">
        [Удалено]
      </span>
    </td>
    <td>
      <template v-if="subscription && group && group !== 'Зал'">
        В группу
        <nuxt-link :to="{ name: 'groups-id', params: { id: group.id } }">
          {{ group.title }}
        </nuxt-link>
      </template>
      <v-skeleton-loader v-else-if="loading" type="table-cell" />
      <template v-else>
        В зал
      </template>
    </td>
    <td>
      {{ $t("methods." + subscriptionsPayment.method) }}
    </td>
    <td>{{ $moment(subscriptionsPayment.updated_at).format('ll')}}</td>
    <td class="text-right">{{ subscriptionsPayment.total }} &#8381;</td>
  </tr>
</template>

<script>
export default {
  name: "SubscriptionsPaymentListItem",
  props: {
    subscriptionsPayment: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
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
      return this.$moment.utc(date).format("LL");
    }
  }
};
</script>

<style scoped></style>
