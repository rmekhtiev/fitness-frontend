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
        <group-form
          v-model="form"
          :halls="$store.getters['halls/all']"
          :trainers="$store.getters['trainers/all']"
          :is-edit="isEdit"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import GroupForm from "./GroupForm"
export default {
  name: "GroupDialog",

  components: {
    GroupForm
  },

  props: {
    fullscreen: {
      type: Boolean,
      default: true
    },

    title: {
      type: String
    },

    group: {
      type: Object,
      required: false
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

    form: {}
  }),

  created() {
    if (this.group) {
      Object.assign(this.form, this.group)
    }
  },

  methods: {
    open(options) {
      this.dialog = true

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },

    save() {
      this.resolve(this.form)
      this.dialog = false
    },

    cancel() {
      this.dialog = false
    }
  }
}
</script>

<style scoped></style>
