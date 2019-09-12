export default {
  computed: {
    selectedHallId() {
      return this.$store.getters['selectedHallIdForFilter'];
    }
  },

  methods: {
    selectedHallFilter(item) {
      return this.selectedHallId === null ? true : item.hall_id === this.selectedHallId;
    }
  }
}
