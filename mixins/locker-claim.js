export default {
  computed: {
    duration() {
      return this.$moment(this.claim.claim_end).diff(this.$moment(this.claim.claim_start), 'days')
    },

    durationLeft() {
      return this.$moment(this.claim.claim_end).diff(this.$moment(), 'days')
    },

    past() {
      return this.durationLeft <= 0;
    }
  }
}
