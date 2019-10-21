<template>
  <div>
    <v-card class="pr-10">
      <v-timeline dense clipped>
        <v-timeline-item fill-dot class="white--text mb-12" large>
          <template>
            <form ref="commentForm">
              <v-text-field v-model="form.text" />
              <v-btn @click="save()">
                Отправить
              </v-btn>
            </form>
          </template>
        </v-timeline-item>

        <v-list v-if="!loading.records">
          <template v-for="comment in comments">
            <v-timeline-item small>
              <v-flex row>
                <v-flex>
                  <div>
                    {{ comment.text }}
                  </div>
                  <div class="body-2 text-truncate grey--text">
                    {{comment.user_name}}
                  </div>
                </v-flex>
                <v-flex class="text-right">
                  {{ commentTime(comment) }}
                </v-flex>
              </v-flex>
            </v-timeline-item>
          </template>
        </v-list>
      </v-timeline>
    </v-card>
  </div>
</template>
<script>
import auth from "../../mixins/auth"

export default {
  name: "IssueDiscussion",
  mixins: [auth],
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },

  data: () => ({
    form: {
      text: null,
      user_id: null,
      issue_id: null
    },

    loading: {
      comments: true
    }
  }),

  computed: {
    commentFilter() {
      return {
        issue_id: this.$route.params.id
      }
    },

    comments() {
      return this.$store.getters["issue-discussions/where"]({
        filter: this.commentFilter
      })
    }
  },

  async mounted() {
    await Promise.all([this.loadComments()])
  },

  methods: {
    loadComments() {
      this.loading.groups = true

      return this.$store
        .dispatch("issue-discussions/loadWhere", {
          filter: this.commentFilter
        })
        .then(() => {
          this.loading.comments = false
        })
    },
    commentTime(comment) {
      return this.$moment.utc(comment.created_at).format("D.M.YYYY в HH:mm")
    },

    save() {
      const IssueId = this.$route.params.id
      this.form.issue_id = this.$route.params.id
      this.form.user_id = this.me.id
      this.$axios.post("issue-discussions", this.form).then(async response => {
        await this.$store.dispatch("issue-discussions/loadWhere", {
          filter: this.commentFilter
        })
        this.router.push({ path: `/issues/${IssueId}` })
      })
    }
  }
}
</script>
