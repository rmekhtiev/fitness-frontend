<template>
  <v-timeline-item
    class="mb-4"
    color="grey"
    small
  >
    <v-row justify="space-between" class="mr-0">
      <v-col cols="7">
        <slot>{{ $t('activity.' + activity.subject_type + '.' + activity.description, {subject: activity.subject}) }}</slot>
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

        computed: {
            subject() {
                // return this.activity.subject;

                return this.$store.getters[this.activity.subject_type + '/byId']({
                    id: this.activity.subject_id
                })
            }
        },

    }
</script>

<style scoped>

</style>
