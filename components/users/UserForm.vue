<template>
  <v-form>
    <v-text-field v-model="value.name" label="ФИО" />
    <v-text-field v-model="value.email" label="E-mail" />
    <v-text-field v-model="value.password" label="Пароль" />
    <v-autocomplete
      v-model="value.primary_role"
      label="Должность"
      :items="roles"
      item-text="name"
      item-value="id"
    />
  </v-form>
</template>

<script>
import _ from "lodash";

import auth from "../../mixins/auth";

export default {
  name: "UserForm",

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

    roles: {
      type: Array,
      default: () => []
    },

    isEdit: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    defaultForm() {
      return {
        name: null,
        email: null,
        password: null,
        primary_role: null
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
