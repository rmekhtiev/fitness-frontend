export default {
  computed: {
    hall() {
      return this.$store.getters['halls/byId']({id: this.employee.hall_id});
    },

    associatedUser() {
      return this.$store.getters['users/byId']({id: this.employee.associated_user_id});
    }
  }
}
