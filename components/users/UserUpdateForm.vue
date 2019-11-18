<template>
  <v-form>
    <v-text-field v-model="value.name" disabled label="ФИО" />
    <v-text-field v-model="value.email" label="E-mail" />
    <v-select
      v-model="value.primary_role_id"
      label="Роль в системе"
      chips
      :items="roles"
      item-text="name"
      item-value="id"
    >
      <template v-slot:selection="roles">
        <v-chip>
          {{ $t("users.primary_role.name." + roles.item.name) }}
        </v-chip>
      </template>
      <template v-slot:item="roles">
        <template>
          <v-list-item-content>
            <v-list-item-title>{{
              $t("users.primary_role.name." + roles.item.name)
            }}</v-list-item-title>
          </v-list-item-content>
        </template>
      </template>
    </v-select>
  </v-form>
</template>

<script>
import _ from "lodash";

import auth from "../../mixins/auth";

export default {
  name: "UserUpdateForm",

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
        primary_role_id: null
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
