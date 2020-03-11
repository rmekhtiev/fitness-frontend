<template>
  <div>
    <v-card class="pr-10">
      <v-timeline dense clipped>
        <v-timeline-item fill-dot class="white--text mb-12" large>
          <template>
            <form ref="commentForm" name="commentForm" @submit.prevent="save()">
              <v-text-field v-model="form.text" />
              <v-btn @click="save()">
                Отправить
              </v-btn>
            </form>
          </template>
        </v-timeline-item>

        <v-list>
          <template v-for="item in comments">
            <issue-comment-item :comment="item" />
          </template>
        </v-list>
      </v-timeline>
    </v-card>
  </div>
</template>
<script>
import auth from "../../mixins/auth";
import IssueCommentItem from "./IssueCommentItem";

export default {
  name: "IssueDiscussion",
  components: { IssueCommentItem },
  mixins: [auth],
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    comments: {
      type: Array,
      default: () => ({})
    }
  },

  data: () => ({
    form: {
      text: null,
      user_id: null,
      issue_id: null
    }
  }),

  methods: {
    save() {
      this.form.issue_id = this.$route.params.id;
      this.form.user_id = this.me.id;
      this.$axios.post("issue-discussions", this.form).then(() => {
        this.$emit("createComment");
        this.form.text = null;
      });
    }
  }
};
</script>
