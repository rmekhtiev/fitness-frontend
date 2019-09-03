export default {
  computed: {
    client() {
      return this.$store.getters['clients/byId']({id: this.booking.client_id});
    },
  }
}
