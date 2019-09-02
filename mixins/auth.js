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
    },

    employee() {
      return this.$store.getters['employees/byId']({id: this.me.associated_employee.id});
    },

    hall() {
      return this.$store.getters['halls/byId']({id: this.me.associated_employee.hall_id});
    }
  },

  methods: {
    role(role) {
      return this.me && this.me.primary_role.name === role;
    }
  }
}
