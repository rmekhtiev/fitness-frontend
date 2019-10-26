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
