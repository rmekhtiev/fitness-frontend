export default {
  data: () => ({
    fab: false,
    tooltips: false,
    tooltipsDisabled: false
  }),

  watch: {
    fab(val) {
      this.tooltips = false;
      this.tooltipsDisabled = false;
      val &&
        setTimeout(() => {
          this.tooltips = true;
          this.$nextTick(() => (this.tooltipsDisabled = true));
        }, 250);
    }
  }
};
