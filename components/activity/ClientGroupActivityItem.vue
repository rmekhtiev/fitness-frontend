<template v-slot>
  <default-activity-item v-bind="$props">
    <i18n :path="'activity.' + activity.subject_type + '.' + activity.description">
      <template slot="client">
        <nuxt-link v-if="client" :to="{name: 'clients-id', params: { id: client.id }}">
          {{ client.name }}
        </nuxt-link>
        <span v-else>[Неизвестно]</span>
      </template>

      <template slot="group">
        <nuxt-link v-if="group" :to="{name: 'groups-id', params: { id: group.id }}">
          {{ group.title }}
        </nuxt-link>
        <span v-else>[Неизвестно]</span>
      </template>
    </i18n>
  </default-activity-item>
</template>

<script>
    import DefaultActivityItem from "./DefaultActivityItem";

    export default {
        extends: DefaultActivityItem,

        name: "ClientGroupActivityItem",

        components: {
            DefaultActivityItem
        },

        computed: {
            client() {
                return this.$store.getters['clients/byId']({
                    id: this.activity.properties.client_id
                })
            },

            group() {
                return this.$store.getters['groups/byId']({
                    id: this.activity.properties.group_id
                })
            }
        }
    }
</script>

<style scoped>

</style>
