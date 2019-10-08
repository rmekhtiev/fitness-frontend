import filterable from "./filterable";

export default {
  mixins: [
    filterable
  ],

  data: () => ({
    resource: '',

    iteratorOptions: {},
    itemsLoading: true,
  }),

  computed: {
    items() {
      return this.$store.getters[this.resource + '/where'](this.serverPayload);
    },

    totalItems() {
      return this.$store.getters[this.resource + '/lastMeta'].pagination.total;
    },

    serverPayload() {
      return {
        filter: this.pureFilter,
        options: {
          page: this.iteratorOptions.page,
          per_page: this.iteratorOptions.itemsPerPage,
        }
      }
    }
  },

  watch: {
    iteratorOptions: {
      handler () {
        this.loadItems();
      },
      deep: true,
    },
  },

  methods: {
    loadItems() {
      this.itemsLoading = true;

      return this.$store.dispatch(this.resource + '/loadWhere', this.serverPayload).then(() => {
        this.itemsLoading = false;
      });
    }
  },

  async beforeMount() {
    await this.loadItems();
  },
}
