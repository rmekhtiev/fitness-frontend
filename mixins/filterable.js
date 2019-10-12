import _ from "lodash"

export default {
  data: () => ({
    filter: {}
  }),

  computed: {
    pureFilter: function() {
      return _(this.filter)
        .omitBy(_.isNull)
        .omitBy(_.isUndefined)
        .value()
    }
  },

  methods: {
    loadItems() {
      console.error("Override this method")
    },

    /**
     * @deprecated
     */
    loadFiltered() {
      console.warn("This method is deprecated")

      this.loadItems()
    }
  }
}
