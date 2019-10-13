<template>
  <v-form>
    <v-autocomplete
      v-model="value.hall_id"
      :disabled="isHallAdmin || isEdit"
      :items="halls"
      label="Зал"
      name="hall_id"
      prepend-icon="mdi-domain"
      item-text="title"
      item-value="id"
    />

    <v-autocomplete
      v-model="value.trainer_id"
      :items="trainersFiltered"
      label="Тренер"
      name="hall_id"
      prepend-icon="mdi-account-star"
      item-text="name"
      item-value="id"
    />

    <v-text-field
      v-model="value.title"
      label="Название группы"
      name="title"
      prepend-icon="mdi-format-color-text"
      required
    />

    <v-text-field
      v-model="value.max_members"
      type="number"
      label="Макс. кол-во участников"
      name="max_members"
      prepend-icon="mdi-account-multiple-outline"
      required
    />
  </v-form>
</template>

<script>
import _ from "lodash"

import { mask } from "vue-the-mask"

import auth from "../../mixins/auth"

export default {
  name: "GroupForm",

  directives: {
    mask
  },

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

    trainers: {
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
        hall_id: this.me.associated_employee
          ? this.me.associated_employee.hall_id
          : null
      }
    },

    trainersFiltered() {
      return this.trainers // todo
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
