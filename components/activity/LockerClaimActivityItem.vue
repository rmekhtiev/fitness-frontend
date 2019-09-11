<template>
  <v-timeline-item
    class="mb-4"
    color="grey"
    small
  >
    <v-row justify="space-between" class="mr-0">
      <v-col cols="7">
        <slot>
          <i18n
            v-if="activity.subject_type === 'clients'"
            :path="'activity.' + activity.subject_type + '.' + activity.description">
            <nuxt-link slot="client" :to="{name: 'clients-id', params: { id: activity.subject.id }}">{{ activity.subject.name }}</nuxt-link>
          </i18n>
        </slot>
      </v-col>
      <v-col class="text-right" cols="5">
        <v-tooltip bottom nudge-left="15">
          <template v-slot:activator="{ on }">
            <span v-on="on">{{ $moment(activity.created_at).format('LT') }}</span>
          </template>
          <span>{{ $moment(activity.created_at).format('lll') }}</span>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-timeline-item>
</template>

<script>
    import DefaultActivityItem from "./DefaultActivityItem";

    export default {
        extends: DefaultActivityItem,

        name: "LockerClaimActivityItem",

        computed: {
            client() {
                return this.$store.getters['clients/byId']({ id: this.subject.client_id })
            },

            locker() {
                return this.$store.getters['clients/byId']({ id: this.subject.client_id })
            }
        }
    }
</script>

<style scoped>

</style>
