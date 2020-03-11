<template>
  <v-form>
    <v-textarea v-model="value.comment" label="Комментарий" />
  </v-form>
</template>

<script>
import _ from "lodash";

import auth from "../../mixins/auth";

export default {
  name: "TrainingSessionCommentForm",

  mixins: [auth],

  props: {
    value: {
      type: Object,
      default: () => ({})
    },

    isEdit: {
      type: Boolean,
      default: false
    }
  },

  created() {
    const newVal = { ...this.value };

    _(this.defaultForm).each((item, index) => {
      if (!this.value[index] || this.value[index] === null) {
        newVal[index] = item;
      }
    });

    this.$emit("input", newVal);
  }
};
</script>

<style scoped></style>
