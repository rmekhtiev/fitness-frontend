import filterable from "./filterable";

export default {
  mixins: [
    filterable
  ],

  data: () => ({
    resource: '',

    iteratorOptions: {
      itemsPerPage: 15,
      page: 1,
    },
    itemsLoading: true,
  }),

  computed: {
    items() {
      return this.$store.getters[this.resource + '/where'](this.serverPayload);
    },

    totalItems() {
      return this.$store.getters[this.resource + '/lastMeta']
        ? this.$store.getters[this.resource + '/lastMeta'].pagination.total
        : 0;
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
      handler() {
        this.loadItems();
      },
      deep: true,
    },
  },

  methods: {
    loadItems() {
      this.itemsLoading = true;

      return this.$store.dispatch(this.resource + '/loadWhere', this.serverPayload).then(async () => {
        return this.loadRelated().then(() => {
          this.itemsLoading = false;
        });
      });
    },

    loadRelated() {
      return Promise.resolve();
    },
  },

  async beforeMount() {
    await this.loadItems();
  },
}
