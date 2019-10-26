<template>
  <v-form>
    <v-autocomplete
      v-model="value.hall_id"
      :disabled="isHallAdmin || isEdit"
      :items="halls"
      label="Зал"
      item-text="title"
      item-value="id"
    />
    <v-autocomplete
      v-model="value.employee_id"
      :items="employees"
      :disabled="isEdit"
      label="Сотрудник"
      item-text="name"
      item-value="id"
    />
    <v-text-field
      v-model="value.topic"
      label="Тема"
      placeholder="Напр.: Сломался тренажер"
    />
    <v-textarea
      v-model="value.description"
      label="Описание проблемы"
      placeholder="Подробное описание проблемы"
    />
  </v-form>
</template>

<script>
import _ from "lodash"

import auth from "../../mixins/auth"

export default {
  name: "IssueForm",

  mixins: [auth],

  props: {
    value: {
      type: Object,
      default: () => ({})
    },

    halls: {
      type: Array,
      default: () => []
    },

    employees: {
      type: Array,
      default: () => []
    },

    description: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      default: ""
    },

    isEdit: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    defaultForm() {
      return {
        hall_id: this.$store.getters["selectedHallId"]
          ? this.$store.getters["selectedHallId"]
          : null,
        employee_id: this.me.associated_employee
          ? this.me.associated_employee.id
          : null,
        topic: null,
        description: null,
        status: "pending"
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
