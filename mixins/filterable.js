export default {
  data: () => ({
    filter: {

    },
  }),

  computed: {
    pureFilter: function () {
      return _(this.filter).omitBy(_.isNull).omitBy(_.isUndefined).value();
    },
  },

  methods: {
    loadFiltered() {
      console.warn('Override this method')
    },
  }
}
