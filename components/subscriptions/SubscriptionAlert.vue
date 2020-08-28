<template>
  <div>
    <v-alert v-if="subscription" v-bind="alertBindings" prominent>
      <v-row align="center">
        <v-col class="grow">
          До окончания действия абонемента в
          <span v-if="subscription.subscriable_id == null">зал</span>
          <span v-else-if="subscription.subscriable_type === 'groups' && group">группу {{ group.title }}</span>
          осталось {{diff}} дней
        </v-col>
      </v-row>
    </v-alert>
  </div>
</template>

<script>
export default {
  name: "SubscriptionAlert",

  props: {
    subscription: {
      required: true,
      type: Object
    }
  },

  computed: {
    diff() {
      const diff =
        this.$moment(this.subscription.valid_till).diff(
          this.$moment(),
          "days"
        ) + 1;
      return diff;
    },
    group() {
      return this.$store.getters["groups/byId"]({
        id: this.subscription.subscriable_id
      });
    },
    alertBindings() {
      if (this.diff > 7) {
        return {
          type: 'success'
        };
      } else
        return {
          type: 'warning'
        };
    }
  }
};
</script>

<style scoped></style>
