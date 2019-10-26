<template>
  <v-form>
    <v-text-field
      v-model="value.password"
      label="Новый пароль"
      :append-icon="password_visible ? 'visibility' : 'visibility_off'"
      :type="password_visible ? 'text' : 'password'"
      @click:append="password_visible = !password_visible"
    />
    <v-text-field
      v-model="value.repeat_password"
      label="Повторите новый пароль"
      :append-icon="repeat_password_visible ? 'visibility' : 'visibility_off'"
      :type="repeat_password_visible ? 'text' : 'password'"
      @click:append="repeat_password_visible = !repeat_password_visible"
    />
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

  data: () => ({
    password_visible: false,
    repeat_password_visible: false
  }),

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
