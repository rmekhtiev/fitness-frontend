<template>
  <v-timeline-item
    class="mb-4"
    color="grey"
    small
  >
    <v-row justify="space-between" class="mr-0">
      <v-col cols="7">
        {{ $t('activity.' + activity.subject_type + '.' + activity.description) }}
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
    export default {
        name: "DefaultActivityItem",

        props: {
            activity: {
                required: true,
                type: Object,
            }
        },
    }
</script>

<style scoped>

</style>
