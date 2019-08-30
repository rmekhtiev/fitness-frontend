import {includes} from 'lodash'

export default {
  computed: {
    isOwner() {
      return this.role('admin')
    },

    me() {
      return this.$auth.user;
    }
  },

  methods: {
    role(role) {
      return this.me && this.me.primaryRole.name === role;
    }
  }
}
