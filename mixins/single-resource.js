export default {
  data: () => ({
    loading: {
      resource: false
    }
  }),

  computed: {
    // todo
  },

  methods: {
    loadRelated() {
      console.warn("Override me");

      return Promise.resolve();
    }
  }
};
