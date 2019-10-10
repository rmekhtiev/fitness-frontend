export default {
  computed: {
    hall() {
      return this.$store.getters['halls/byId']({id: this.group.hall_id});
    },

    nextEvent() {
      return this.group.upcoming_events[0];
    }
  }
}
