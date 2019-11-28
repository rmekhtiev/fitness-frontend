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
        <training-session-form
          v-model="form"
          :trainers="hallTrainers"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import _ from "lodash"
  import selectedHallAware from "../../mixins/selected-hall-aware";
import employee from "../../mixins/employee";
import TrainingSessionForm from "./TrainingSessionForm";

export default {
  name: "TrainingSessionDialog",

  components: {
    TrainingSessionForm
  },
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
  computed: {
    hallTrainers() {
      return _(this.$store.getters["trainers/all"]).filter({
        hall_id: this.selectedHallId
      }).value();
    }
  },

  created() {
    if (this.group) {
      Object.assign(this.form, this.group);
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
