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
  }
}
