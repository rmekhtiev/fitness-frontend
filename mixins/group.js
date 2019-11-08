export default {
  data: () => ({
    loading: {
      resource: false,
      trainer: true,
      hall: true,
      clients: true,
      schedules: true
    }
  }),

  computed: {
    nextEvent() {
      return this.group.upcoming_events ? this.group.upcoming_events[0] : null;
    },

    relationFilters() {
      return {
        clients: {
          parent: {
            type: "groups",
            id: this.$route.params.id
          },
          options: {
            per_page: -1
          }
        },

        schedules: {
          filter: {
            schedulable_type: "groups",
            schedulable_id: this.$route.params.id
          },
          options: {
            per_page: -1
          }
        }
      };
    },

    // Relations
    hall() {
      return this.$store.getters["halls/byId"]({
        id: this.group.hall_id
      });
    },

    trainer() {
      return this.$store.getters["trainers/byId"]({
        id: this.group.trainer_id
      });
    },

    clients() {
      return this.$store.getters["clients/related"](
        this.relationFilters.clients
      );
    },

    schedules() {
      return this.$store.getters["schedules/where"](
        this.relationFilters.schedules
      );
    }
  },

  methods: {
    loadRelated() {
      const promises = [
        this.loadTrainer(),
        this.loadHall(),
        this.loadClients(),
        this.loadSchedules()
      ];

      return Promise.all(promises);
    },

    loadHall() {
      if (!this.group.hall_id) {
        this.loading.hall = false;
        return Promise.resolve();
      }

      this.loading.hall = true;

      return this.$store
        .dispatch("halls/loadById", {
          id: this.group.hall_id
        })
        .then(() => {
          this.loading.hall = false;
        });
    },

    loadTrainer() {
      if (!this.group.trainer_id) {
        this.loading.trainer = false;
        return Promise.resolve();
      }

      this.loading.trainer = true;

      return this.$store
        .dispatch("trainers/loadById", {
          id: this.group.trainer_id
        })
        .then(() => {
          this.loading.trainer = false;
        });
    },

    loadClients() {
      this.loading.clients = true;

      return this.$store
        .dispatch("clients/loadRelated", this.relationFilters.clients)
        .then(() => {
          this.loading.clients = false;
        });
    },

    loadSchedules() {
      this.loading.schedules = true;

      this.$store
        .dispatch("schedules/loadWhere", this.relationFilters.schedules)
        .then(() => {
          this.loading.schedules = false;
        });
    }
  }
};
