export default {
  computed: {
    duration() {
      return this.$moment(this.claim.claim_end).diff(
        this.$moment(this.claim.claim_start),
        "days"
      );
    },

    durationLeft() {
      return this.$moment(this.claim.claim_end).diff(this.$moment(), "days");
    },

    past() {
      return this.durationLeft < 0;
    },

    future() {
      return this.$moment(this.claim.claim_start).isAfter(this.$moment());
    },

    durationPercent() {
      return 100 - (this.durationLeft / this.duration) * 100;
    }
  }
};
