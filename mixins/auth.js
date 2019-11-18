export default {
  computed: {
    isOwner() {
      return this.role("owner");
    },

    isHallAdmin() {
      return this.role("hall_admin");
    },

    me() {
      return this.$auth.user;
    }
  },

  methods: {
    role(role) {
      return this.me && this.me.primary_role.name === role;
    }
  },

  beforeMount() {
    if (this.me.associated_employee) {
      // todo
    }

    if (this.isOwner) {
      this.$store.dispatch("halls/loadAll");
    } else if (this.isHallAdmin && this.me.employee_id) {
      this.$store
        .dispatch("employees/loadById", { id: this.me.employee_id })
        .then(() => {
          const employee = this.$store.getters["employees/byId"]({
            id: this.me.employee_id
          });

          this.$store
            .dispatch("halls/loadById", { id: employee.hall_id })
            .then(() => {
              const hall = this.$store.getters["halls/byId"]({
                id: employee.hall_id
              });
              this.$store.dispatch("selectHall", hall);
            });
        });
    }
  }
};
