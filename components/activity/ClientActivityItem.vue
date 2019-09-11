<template>
  <v-timeline-item
    class="mb-4"
    color="primary"
    small
  >
    <v-row justify="space-between" class="mr-0">
      <v-col cols="7">
        <i18n :path="'activity.' + activity.subject_type + '.' + activity.description">
          <nuxt-link slot="action" :to="{name: 'clients-id', params: { id: client.id }}">{{ client.name }}</nuxt-link>
        </i18n>
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
    import client from "../../mixins/client";

    import DefaultActivityItem from "./DefaultActivityItem";

    export default {
        extends: DefaultActivityItem,

        name: "ClientActivityItem",

        mixins: [
            client,
        ],

        computed: {
            client() {
                return this.activity.subject
            }
        }
    }
</script>

<style scoped>

</style>
