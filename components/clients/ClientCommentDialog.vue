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
        <client-comment-form v-model="form" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import selectedHallAware from "../../mixins/selected-hall-aware";
import ClientCommentForm from "./ClientCommentForm";

export default {
  name: "ClientCommentDialog",
  components: { ClientCommentForm },
  mixins: [selectedHallAware],

  props: {
    fullscreen: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ""
    },
    client: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },

  data: () => ({
    dialog: false,

    resolve: null,
    reject: null,

    form: {
      comment: null
    }
  }),

  created() {
    if (this.session) {
      Object.assign(this.form, this.client);
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
