export default {
  computed: {
    duration() {
      return this.$moment(this.activeSubscription.valid_till).diff(this.$moment(this.activeSubscription.issue_date), 'days')
    },

    durationLeft() {
      return this.$moment(this.activeSubscription.valid_till).diff(this.$moment(), 'days')
    },

    durationPercent() {
      return 100 - (this.durationLeft / this.duration) * 100;
    },
    groupsIds() {
      return this.client ? this.client.groups.map(group => group.id) : [];
    }
  },
}
