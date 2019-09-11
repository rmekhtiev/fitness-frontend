<template>
  <v-timeline-item
    class="mb-4"
    :color="color"
    small
  >
    <v-row justify="space-between" class="mr-0">
      <v-col cols="7">
        <slot>
          {{ $t('activity.' + this.activity.subject_type + '.' + this.activity.description, {subject: this.activity.subject}) }}
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
    // import Colorable from 'vuetify/es5/mixins/colorable'

    export default {
        name: "DefaultActivityItem",

        props: {
            activity: {
                required: true,
                type: Object,
            },

            color: {
                type: String,
                default: 'primary'
            }
        },

        computed: {
            subject() {
                return this.$store.getters[this.activity.subject_type + '/byId']({
                    id: this.activity.subject_id
                })
            },

            slot() {
                return this.$t('activity.' + this.activity.subject_type + '.' + this.activity.description, {subject: this.activity.subject});
            }
        },

    }
</script>

<style scoped>

</style>
