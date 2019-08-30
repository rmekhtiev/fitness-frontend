export default {
  computed: {
    primaryHall() {
      return this.$store.getters['halls/byId']({id: this.client.primary_hall_id});
    }
  }
}
