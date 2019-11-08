<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12 sm12 lg8 xl6>
        <issue-info-card :issue="issue" class="mb-2 mx-auto" />
        <issue-discussion
          :comments="comments"
          @createComment="loadComments()"
        />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import IssueInfoCard from "../../components/issues/IssueInfoCard";
import IssueDiscussion from "../../components/issues/IssueDiscussion";

export default {
  components: {
    IssueDiscussion,
    IssueInfoCard
  },

  data: () => ({
    loading: {
      comments: true
    }
  }),

  computed: {
    issue() {
      return this.$store.getters["issues/byId"]({ id: this.$route.params.id });
    },
    commentFilter() {
      return {
        issue_id: this.$route.params.id
      };
    },
    comments() {
      return this.$store.getters["issue-discussions/where"]({
        filter: this.commentFilter
      });
    }
  },

  fetch({ store, params }) {
    return Promise.all([
      store.dispatch("issues/loadById", { id: params.id }),
      store.dispatch("halls/loadAll"),
      store.dispatch("employees/loadAll")
    ]);
  },

  created() {
    this.interval = setInterval(() => this.loadComments(), 3000);
  },

  beforeDestroy() {
    clearInterval(this.interval);
  },

  async mounted() {
    await Promise.all([this.loadComments()]);
  },

  methods: {
    loadComments() {
      this.loading.groups = true;
      return this.$store
        .dispatch("issue-discussions/loadWhere", {
          filter: this.commentFilter
        })
        .then(() => {
          this.loading.comments = false;
        });
    }
  },

  head() {
    return {
      title: "Проблема" // todo:
    };
  }
};
</script>

<style scoped></style>
