<template v-slot>
  <default-activity-item v-bind="$props">
    <i18n
      :path="'activity.' + activity.subject_type + '.' + activity.description"
    >
      <nuxt-link
        slot="issue"
        :to="{ name: 'issues-id', params: { id: activity.subject.id } }"
      >
        {{ activity.subject.topic }}
      </nuxt-link>
      <nuxt-link
        slot="hall"
        :to="{ name: 'halls-id', params: { id: hall.id } }"
      >
        {{ hall.title }}
      </nuxt-link>
    </i18n>
  </default-activity-item>
</template>

<script>
import DefaultActivityItem from "./DefaultActivityItem";

export default {
  name: "IssueActivityItem",

  components: {
    DefaultActivityItem
  },
  extends: DefaultActivityItem,

  computed: {
    hall() {
      return this.$store.getters["halls/byId"]({
        id: this.activity.subject.hall_id
      });
    }
  }
};
</script>

<style scoped></style>
