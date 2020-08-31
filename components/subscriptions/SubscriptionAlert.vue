<template>
  <div>
    <v-alert v-if="subscription" v-bind="alertBindings" prominent>
      <v-row align="center">
        <v-col class="grow" v-if="diff > 1">
          До окончания действия абонемента в
          <span v-if="subscription.subscriable_id == null">зал</span>
          <span v-else-if="subscription.subscriable_type === 'groups' && group">группу {{ group.title }}</span>
          осталось {{diff}} дней
        </v-col>
        <v-col class="grow" v-else>
          Абонемент в
          <span v-if="subscription.subscriable_id == null">зал</span>
          <span v-else-if="subscription.subscriable_type === 'groups' && group">группу {{ group.title }}</span>
          заканчивается 
          <span v-if="diff == 0">сегодня</span>
          <span v-else>завтра</span>
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
      let valid_till = this.$moment(this.subscription.valid_till).add(1, 'days')
      const diff =
        valid_till.diff(
          this.$moment(),
          "days"
        );

        return diff
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
