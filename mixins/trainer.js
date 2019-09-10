export default {
    computed: {
        hall() {
            return this.$store.getters['halls/byId']({id: this.trainer.hall_id});
        },

        associatedEmployee() {
            return this.$store.getters['employees/byId']({id: this.trainer.associated_employee_id});
        }
    }
}
