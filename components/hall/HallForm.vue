<template>
  <v-form>
    <v-text-field v-model="value.title" label="Название зала" />
    <v-text-field v-model="value.address" label="Адрес" />
  </v-form>
</template>

<script>
export default {
  name: "HallForm",

  props: {
    value: {
      type: Object,
      default: () => ({})
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
        address: null
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
