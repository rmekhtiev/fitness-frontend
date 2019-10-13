<template>
  <v-form>
    <v-text-field v-model="value.title" label="Название" />
    <v-text-field
      v-model="value.amount"
      min="1"
      type="number"
      label="Количество"
    />
    <v-text-field v-model="value.cost" min="1" type="number" label="Цена" />
    <v-autocomplete
      v-model="value.hall_id"
      :disabled="isHallAdmin || isEdit"
      :items="halls"
      label="Зал"
      item-text="title"
      item-value="id"
    />
  </v-form>
</template>

<script>
import _ from "lodash"

import auth from "../../mixins/auth"

export default {
  name: "BarForm",

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

    isEdit: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    defaultForm() {
      return {
        title: null,
        amount: null,
        cost: null,
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
