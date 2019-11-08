<template>
  <v-form>
    <v-autocomplete
      v-model="value.associated_employee_id"
      :items="employees"
      :disabled="isEdit"
      label="Сотрудник"
      prepend-icon="mdi-account-badge-horizontal-outline"
      item-text="name"
      item-value="id"
    />
    <v-text-field
      v-model="value.phone_number"
      v-mask="'+7 (###) ###-##-##'"
      prepend-icon="mdi-phone-outline"
      label="Номер телефона"
    />
  </v-form>
</template>

<script>
import _ from "lodash";

import { mask } from "vue-the-mask";

import auth from "../../mixins/auth";

export default {
  name: "IssueForm",

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

    isEdit: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    defaultForm() {
      return {
        phone_number: null,
        associated_employee_id: null
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
