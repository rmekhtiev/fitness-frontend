export default {
  computed: {
    selectedHallId() {
      return this.$store.getters['selectedHallIdForFilter'];
    }
  },

  watch: {
    selectedHallId() {
      this.loadItems();
    },
  },

  methods: {
    selectedHallFilter(item) {
      return this.selectedHallId === null ? true : item.hall_id === this.selectedHallId;
    },

    // loadItems() {
    //   console.error('Override this method');
    // }
  }
}
