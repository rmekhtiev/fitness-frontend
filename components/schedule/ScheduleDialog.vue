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
        <schedule-form
          v-model="form"
          :trainers="$store.getters['trainers/all']"
          :min="min"
          :max="max"
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
    },

    min: {
      type: String,
      default: undefined
    },

    max: {
      type: String,
      default: undefined
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
