<template v-slot>
  <default-activity-item v-bind="$props">
    <i18n
      :path="'activity.' + activity.subject_type + '.' + activity.description"
    >
      <nuxt-link
        slot="client"
        :to="{ name: 'clients-id', params: { id: client.id } }"
      >
        {{ client.name }}
      </nuxt-link>
      <nuxt-link
        slot="locker"
        :to="{ name: 'lockers-id', params: { id: locker.id } }"
      >
        &#8470;{{ locker.number }}
      </nuxt-link>
      <span slot="duration">{{ subject.duration }} дней</span>
    </i18n>
  </default-activity-item>
</template>

<script>
import DefaultActivityItem from "./DefaultActivityItem";

export default {
  name: "LockerClaimActivityItem",

  components: {
    DefaultActivityItem
  },
  extends: DefaultActivityItem,

  computed: {
    client() {
      return this.$store.getters["clients/byId"]({
        id: this.subject.client_id
      });
    },

    locker() {
      return this.$store.getters["lockers/byId"]({
        id: this.subject.locker_id
      });
    }
  }
};
</script>

<style scoped></style>
