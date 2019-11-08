const schedule = {
  computed: {},
  methods: {
    deleteItem(item) {
      this.$store.dispatch("schedules/delete", { id: item.id });
    }
  }
};

export default schedule;
