<template>
  <div v-if="issue">
    <v-card>
      <div class="text-right pt-4">
        <v-btn
          v-if="isHallAdmin || isOwner"
          color="primary"
          text
          small
          @click="updateIssue()"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>

        <v-btn
          v-if="isHallAdmin || isOwner"
          color="red"
          text
          small
          @click="deleteIssue()"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
      <v-list-item>
        <v-list-item-avatar color="grey" />
        <v-list-item-content>
          <v-list-item-title class="headline">
            {{ issue.topic }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ $t("statuses.all." + issue.status) }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list two-line>
        <v-list-item nuxt exact>
          <v-list-item-icon>
            <v-icon color="primary">
              mdi-account
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-if="employee">
              {{ employee.full_name }}
            </v-list-item-title>
            <v-list-item-title v-else>
              Не указан
            </v-list-item-title>
            <div class="body-2 text-truncate">
              {{ primaryHall.title }}
            </div>
          </v-list-item-content>
        </v-list-item>
        <v-card-text>
          {{ issue.description }}
        </v-card-text>
      </v-list>
    </v-card>

    <issue-dialog
      ref="issueDialog"
      title="Правка проблемы"
      :issue="issue"
      is-edit
    />
    <confirm ref="delete" />
  </div>
</template>

<script>
import Confirm from "../Confirm";
import auth from "../../mixins/auth";
import issue from "../../mixins/issue";
import IssueDialog from "./IssueDialog";

export default {
  name: "IssueInfoCard",

  components: {
    Confirm,
    IssueDialog
  },

  mixins: [auth, issue],

  props: {
    issue: {
      type: Object,
      required: true
    }
  },

  methods: {
    updateIssue() {
      this.$refs.issueDialog.open().then(form => {
        this.$axios
          .patch("issues/" + this.issue.id, form)
          .then(async response => {
            await this.$store.dispatch("issues/loadById", {
              id: response.data.data.id
            });
          });

        this.$emit("update");
      });
    },

    deleteIssue() {
      this.$refs.delete
        .open(
          "Удалить сотрудника?",
          "Вы уверены? Это действие невозможно отменить",
          { color: "red" }
        )
        .then(confirm => {
          if (confirm) {
            this.$store.dispatch("issues/delete", { id: this.issue.id });
            this.$toast.success("Проблема удалена");
            this.$emit("delete");
            this.$router.back();
          }
        });
    }
  }
};
</script>

<style scoped></style>
