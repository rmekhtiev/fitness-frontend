<template>
  <v-form>
    <v-autocomplete
      v-model="value.employee_id"
      :items="employees"
      label="ФИО"
      item-text="full_name"
      item-value="id"
    >
    </v-autocomplete>
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
    <v-text-field
      v-model="value.password"
      label="Новый пароль"
      :append-icon="password_visible ? 'visibility' : 'visibility_off'"
      :type="password_visible ? 'text' : 'password'"
      @click:append="password_visible = !password_visible"
    />
    <v-text-field
      v-model="value.password_confirmation"
      label="Повторите новый пароль"
      :append-icon="
        password_confirmation_visible ? 'visibility' : 'visibility_off'
      "
      :type="password_confirmation_visible ? 'text' : 'password'"
      @click:append="
        password_confirmation_visible = !password_confirmation_visible
      "
    />
    <v-btn color="primary" @click="generatePassword()">
      Случайный пароль
    </v-btn>
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
    employees: {
      type: Array,
      required: false,
      default: () => []
    },

    isEdit: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "text"
    },
    size: {
      type: String,
      default: "6"
    },
    characters: {
      type: String,
      default: "a-z,A-Z,0-9"
    }
  },

  data: () => ({
    password_visible: false,
    password_confirmation_visible: false
  }),

  computed: {
    defaultForm() {
      return {
        employee_id: null,
        email: null,
        password: null,
        password_confirmation: null,
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
  },
  methods: {
    generatePassword() {
      const charactersArray = this.characters.split(",");
      let CharacterSet = "";
      let password = "";

      if (charactersArray.includes("a-z")) {
        CharacterSet += "abcdefghijklmnopqrstuvwxyz";
      }
      if (charactersArray.includes("A-Z")) {
        CharacterSet += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      }
      if (charactersArray.includes("0-9")) {
        CharacterSet += "0123456789";
      }

      for (let i = 0; i < this.size; i++) {
        password += CharacterSet.charAt(
          Math.floor(Math.random() * CharacterSet.length)
        );
      }
      this.value.password = password;
      this.value.password_confirmation = password;
      this.password_visible = true;
      this.password_confirmation_visible = true;
    }
  }
};
</script>

<style scoped></style>
