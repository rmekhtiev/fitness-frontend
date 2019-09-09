import {includes} from 'lodash'

export default {
  computed: {
    isOwner() {
      return this.role('owner')
    },

    isHallAdmin() {
      return this.role('hall_admin')
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

    }

    if (this.isOwner) {
      this.$store.dispatch('halls/loadAll');
    } else if (this.isHallAdmin && this.me.associated_employee) {
      this.$store.dispatch('employees/loadById', {id: this.me.associated_employee.id}).then(() => {
        const employee = this.$store.getters['employees/byId']({id: this.me.associated_employee.id});

        this.$store.dispatch('halls/loadById', {id: employee.hall_id}).then(() => {
          const hall = this.$store.getters['halls/byId']({id: employee.hall_id});
          this.$store.dispatch('selectHall', hall);
        });
      });
    }
  }
}
