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
        <user-form v-model="form" :roles="roles" :is-edit="isEdit" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import UserForm from "./UserForm";
export default {
  name: "UserDialog",

  components: { UserForm },
  props: {
    fullscreen: {
      type: Boolean,
      default: true
    },

    title: {
      type: String,
      default: ""
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
      name: null,
      email: null,
      password: null,
      primary_role: null
    }
  }),

  computed: {
    roles() {
      return this.$store.getters["roles/all"];
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
      this.resolve(this.form);
      this.dialog = false;
    },

    cancel() {
      this.dialog = false;
    }
  }
};
</script>

<style scoped></style>
