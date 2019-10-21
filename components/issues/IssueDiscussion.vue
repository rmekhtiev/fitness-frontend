<template>
  <div>
    <v-card class="pr-10">
      <v-timeline dense clipped>
        <v-timeline-item fill-dot class="white--text mb-12" large>
          <v-text-field
            hide-details
            flat
            label="Комментировать..."
            solo
          >
            <template v-slot:append>
              <v-btn>
                Комментировать
              </v-btn>
            </template>
          </v-text-field>
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
                    Денис Тихонов
                    <!--todo добавить атрибут-->
                  </div>
                </v-flex>
                <v-flex class="text-right">
                  {{ comment.created_at }}
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
export default {
  name: "IssueDiscussion",
  data: () => ({
    loading: {
      lockers: true,
      groups: true
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
    }
  }
}
</script>
