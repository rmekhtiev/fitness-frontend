<template v-slot>
  <default-activity-item v-bind="$props">
    <i18n
      :path="'activity.' + activity.subject_type + '.' + activity.description"
    >
      <nuxt-link
        slot="client"
        :to="{ name: 'clients-id', params: { id: activity.subject.id } }"
      >
        {{ activity.subject.name }}
      </nuxt-link>
    </i18n>
  </default-activity-item>
</template>

<script>
import DefaultActivityItem from "./DefaultActivityItem"

export default {
  name: "ClientActivityItem",

  components: {
    DefaultActivityItem
  },
  extends: DefaultActivityItem
}
</script>

<style scoped></style>
