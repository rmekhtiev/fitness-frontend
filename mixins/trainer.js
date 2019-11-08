export default {
  computed: {
    associatedEmployee() {
      return this.$store.getters["employees/byId"]({
        id: this.trainer.associated_employee_id
      });
    },
    hall() {
      return this.$store.getters["halls/byId"]({
        id: this.associatedEmployee.hall_id
      });
    }
  }
};
