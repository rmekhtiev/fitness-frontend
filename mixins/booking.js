export default {
  computed: {
    duration() {
      return this.$moment(this.booking.book_end).diff(this.$moment(this.booking.book_start), 'days')
    },

    durationLeft() {
      return this.$moment(this.booking.book_end).diff(this.$moment(), 'days')
    }
  }
}
