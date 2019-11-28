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
        <event-form ref="form" v-model="form" :sessions="sessions" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import EventForm from "./EventForm";

export default {
  name: "EventDialog",

  components: {
    EventForm
  },

  props: {
    fullscreen: {
      type: Boolean,
      default: true
    },

    title: {
      type: String,
      default: ""
    },

    default: {
      type: Object,
      required: false,
      default: () => ({})
    },

    sessions: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    dialog: false,

    resolve: null,
    reject: null,

    form: {}
  }),

  created() {
    if (this.default) {
      Object.assign(this.form, this.default);
    }
  },

  methods: {
    open({ startDate }) {
      this.dialog = true;

      setTimeout(() => {
        this.form.start_date = startDate;
        this.$refs.form.proxy.start_date = startDate;
      }, 200);

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
