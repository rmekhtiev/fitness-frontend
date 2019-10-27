<template>
  <v-layout>
    <v-flex xs2 md2>
      <div style="display: flex; width: 100%">
        <div style="flex: 1 1 0%;" class="text-truncate">
          <div class="body-2 text-truncate" :title="employee.name">
            {{ employee.name }}
          </div>
        </div>
      </div>
    </v-flex>

    <v-flex xs3 md3>
      <div style="display: flex; width: 100%">
        <div style="flex: 1 1 0%;" class="text-truncate">
          <div class="body-2 text-truncate" :title="hall.title">
            {{ hall.title }}
          </div>
          <div class="caption text-truncate" :title="hall.address">
            {{ hall.address }}
          </div>
        </div>
      </div>
    </v-flex>

    <v-flex xs2 md3>
      <div style="display: flex; width: 100%">
        <div style="flex: 1 1 0%;" class="text-truncate">
          <div class="body-2 text-truncate" :title="issue.status">
            {{ $t("statuses.all." + issue.status) }}
          </div>
        </div>
      </div>
    </v-flex>

    <v-flex xs3 md6>
      <div style="display: flex; width: 100%">
        <div style=" flex: 1 1 0; width: 0;" class="text-truncate">
          <div class="body-2 text-truncate" :title="issue.topic">
            {{ issue.topic }}
          </div>
        </div>
      </div>
    </v-flex>

    <v-flex xs2 md3>
      <div style="display: flex; width: 100%">
        <div style="flex: 1 1 0%;" class="text-truncate text-right">
          <div class="body-2 text-truncate" :title="issue.updated_at">
            {{ updatedDay }}
          </div>
          <div class="caption text-truncate">
            {{ updatedTime }}
          </div>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import issue from "../../mixins/issue";

export default {
  name: "IssueListItem",

  mixins: [issue],

  props: {
    issue: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped></style>
