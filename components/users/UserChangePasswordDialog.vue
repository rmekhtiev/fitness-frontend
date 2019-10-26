<template>
  <v-dialog v-model="dialog" :fullscreen="fullscreen" @keydown.esc="cancel">
    <v-card>
      <v-toolbar dark color="primary" class="mb-4">
        <v-btn icon dark @click="cancel()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <div class="flex-grow-1" />
        <v-toolbar-items>
          <v-btn dark text @click="save">
            Сохранить
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <user-change-password-form
          v-model="form"
          :is-edit="isEdit"
        ></user-change-password-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import UserChangePasswordForm from "./UserChangePasswordForm";
export default {
  name: "UserChangePasswordDialog",

  components: { UserChangePasswordForm },
  props: {
    fullscreen: {
      type: Boolean,
      default: true
    },

    title: {
      type: String,
      default: ""
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
    dialog: false,

    resolve: null,
    reject: null,

    form: {
      password: null,
      repeat_password: null
    }
  }),

  created() {
    if (this.user) {
      Object.assign(this.form, this.user);
    }
  },

  methods: {
    open() {
      this.dialog = true;

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },

    save() {
      if (this.form.password === this.form.repeat_password) {
        this.resolve(this.form);
        this.dialog = false;
      } else {
        console.log("пароли разные");
      }
    },

    cancel() {
      this.dialog = false;
    }
  }
};
</script>

<style scoped></style>
