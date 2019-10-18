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
    <v-text-field v-model="value.number" label="Номер шкафчика" />
  </v-form>
</template>

<script>
import _ from "lodash";

import auth from "../../mixins/auth";

export default {
  name: "LockerForm",

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
        hall_id: this.$store.getters.selectedHallId
          ? this.$store.getters.selectedHallId
          : null,
        number: null
      };
    }
  },

  created() {
    const newVal = { ...this.value };

    _(this.defaultForm).each((item, index) => {
      if (!this.value[index]) {
        newVal[index] = item;
      }
    });

    this.$emit("input", newVal);
  }
};
</script>

<style scoped></style>
