export default {
  data: () => ({
    loading: {
      resource: false
    }
  }),

  computed: {
    isLoading() {
      return Object.values(this.loading).some(element => element === true);
    }
  },

  methods: {
    loadRelated() {
      console.warn("Override me");

      return Promise.resolve();
    }
  }
};
