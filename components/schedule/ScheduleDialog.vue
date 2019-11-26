<template>
  <v-dialog v-model="dialog" :fullscreen="fullscreen" @keydown.esc="cancel">
    <v-card>
      <v-toolbar dark color="primary" class="mb-4">
        <v-btn @click="cancel()" icon dark>
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <div class="flex-grow-1" />
        <v-toolbar-items>
          <v-btn @click="save" dark text>
            Сохранить
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <schedule-form
          v-model="form"
          :trainers="$store.getters['trainers/all']"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import ScheduleForm from "./ScheduleForm";
export default {
  name: "ScheduleDialog",

  components: {
    ScheduleForm
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

    trainers: {
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
