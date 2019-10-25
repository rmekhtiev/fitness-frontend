<template>
  <v-form>
    <v-text-field v-model="value.password" label="Новый пароль" />
  </v-form>
</template>

<script>
import _ from "lodash";

import auth from "../../mixins/auth";

export default {
  name: "UserChangePasswordForm",

  mixins: [auth],

  props: {
    value: {
      type: Object,
      default: () => ({})
    },

    user: {
      type: Object,
      required: false,
      default: () => ({})
    },

    isEdit: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    defaultForm() {
      return {
        password: null
      };
    }
  },

  created() {
    const newVal = { ...this.value };

    _(this.defaultForm).each((item, index) => {
      if (!this.value[index]) {
        newVal[index] = item;
      }
    });

    this.$emit("input", newVal);
  }
};
</script>

<style scoped></style>
