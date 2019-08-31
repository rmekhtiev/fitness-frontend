export default {
  computed: {
    hall() {
      return this.$store.getters['halls/byId']({id: this.employee.hall_id});
    }
  }
}
