<template>
  <v-timeline-item small>
    <v-flex row>
      <v-flex>
        <div>
          {{ comment.text }}
        </div>
        <div class="body-2 text-truncate grey--text">
          {{ comment.user_name }}
        </div>
      </v-flex>
      <v-flex class="text-right">
        {{ commentTime(comment) }}
      </v-flex>
    </v-flex>
  </v-timeline-item>
</template>

<script>
export default {
  name: "IssueCommentItem",
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  methods: {
    commentTime(comment) {
      return this.$moment.utc(comment.created_at).format("D.M.YYYY в HH:mm")
    }
  }
}
</script>

<style scoped></style>
