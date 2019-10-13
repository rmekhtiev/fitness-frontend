<template>
  <v-form>
    <v-text-field v-model="value.last_name" label="Фамилия" />
    <v-text-field v-model="value.first_name" label="Имя" />

    <v-text-field v-model="value.middle_name" label="Отчество" />
    <v-autocomplete
      v-model="value.hall_id"
      :items="halls"
      label="Зал"
      item-text="title"
      item-value="id"
    />
  </v-form>
</template>

<script>
import _ from "lodash"

import { mask } from "vue-the-mask"

import auth from "../../mixins/auth"

export default {
  name: "EmployeeForm",

  directives: {
    mask
  },

  mixins: [auth],

  props: {
    value: {
      type: Object,
      default: () => ({})
    },

    employees: {
      type: Array,
      default: () => []
    },

    halls: {
      type: Array,
      default: () => []
    },

    isEdit: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    defaultForm() {
      return {
        first_name: null,
        middle_name: null,
        last_name: null,
        hall_id: this.$store.getters["selectedHallId"]
          ? this.$store.getters["selectedHallId"]
          : null
      }
    }
  },

  created() {
    let newVal = { ...this.value }

    _(this.defaultForm).each((item, index) => {
      if (!this.value[index]) {
        newVal[index] = item
      }
    })

    this.$emit("input", newVal)
  }
}
</script>

<style scoped></style>
