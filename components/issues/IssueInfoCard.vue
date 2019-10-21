<template>
  <div>
    <v-card :class="classes" :to="to">
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
            <v-list-item-title>
              {{ employee.full_name }}
            </v-list-item-title>
            <div class="body-2 text-truncate">
              {{ primaryHall.title }}
            </div>
          </v-list-item-content>
        </v-list-item>

        <v-list-item nuxt exact>
          <v-list-item-icon>
            <v-icon color="primary">
              mdi-tooltip-text
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <div>
              {{ issue.description }}
            </div>
            <div class="body-2 text-truncate">
              {{ issue.id }}
            </div>
          </v-list-item-content>
        </v-list-item>
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
import routable from "vuetify/es5/mixins/routable"
import IssueDialog from "./IssueDialog"
import Confirm from "../Confirm"
import auth from "../../mixins/auth"

export default {
  name: "IssueInfoCard",

  components: {
    Confirm,
    IssueDialog
  },
  // extend: VCard,

  mixins: [routable, auth],

  props: {
    link: {
      type: Boolean,
      default: false
    },
    issue: {
      type: Object,
      required: true
    }
  },

  computed: {
    componentTag() {
      return "v-card"
    },

    primaryHall() {
      return this.$store.getters["halls/byId"]({ id: this.issue.hall_id })
    },

    employee() {
      return this.$store.getters["employees/byId"]({
        id: this.issue.employee_id
      })
    },

    classes() {
      return {
        ...routable.options.computed.classes.call(this)
      }
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
            })
          })

        this.$emit("update")
      })
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
            let issueId = this.issue.id

            this.$store.dispatch("issues/delete", { id: this.issue.id })

            this.$emit("delete")
          }
          this.$router.push({ path: "/issues" })
        })
    }
  }
}
</script>

<style scoped>
.v-card {
  /*background-color: #41b883;*/
}
</style>
