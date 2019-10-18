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
        <issue-form
          v-model="form"
          :halls="halls"
          :employees="employees"
          :is-edit="isEdit"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import IssueForm from "../../components/issues/IssueForm";
export default {
  name: "IssueDialog",

  components: {
    IssueForm
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

    isEdit: {
      type: Boolean,
      default: false
    }
  },

  // beforeMount() {
  //     return Promise.all([ // todo
  //         this.$store.dispatch('halls/loadAll'),
  //     ])
  // },
  data: () => ({
    dialog: false,

    resolve: null,
    reject: null,

    form: {
      hall_id: null,
      employee_id: null,
      description: null,
      status: null
    }
  }),

  computed: {
    halls() {
      return this.$store.getters["halls/all"];
    },
    employees() {
      return this.$store.getters["employees/all"];
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
