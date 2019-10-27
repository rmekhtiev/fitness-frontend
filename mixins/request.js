export default {
  computed: {

    createdDay() {
      const date = this.$moment.utc(this.request.created_at).local();
      return date.format("DD MMMM");
    },
    createdTime() {
      return this.$moment
        .utc(this.request.created_at)
        .local()
        .format("HH:mm");
    },

    phoneNumber() {
      let phone = this.request.phone;

      phone = phone.replace(/\D/g, '');

      phone = phone.slice(0,1)+"-" + phone.slice(1,4)+"-"+phone.slice(4,7)+"-"+phone.slice(7,11);

      return phone;
    },
  }
};
