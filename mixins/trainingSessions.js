const trainingSessionsMixin = {
  methods: {
    sellTrainingSession(session, method = "cash") {
      return this.$axios
        .post("training-sessions/" + session.id + "/sell", {
          payment_method: method
        })
        .then(() => this.$emit("update"));
    }
  }
};

export default trainingSessionsMixin;
