export default {
  computed: {
    barPaymentsFilter() {
      return {
        sellable_type: "bar-items",
        ...this.pureFilter
      };
    },
    barPayments() {
      return this.$store.getters["payments/where"]({
        filter: this.barPaymentsFilter
      });
    },
    trainingsPaymentsFilter() {
      return {
        sellable_type: "training-sessions",
        ...this.pureFilter
      };
    },
    trainingsPayments() {
      return this.$store.getters["payments/where"]({
        filter: this.trainingsPaymentsFilter
      });
    },
    subscriptionsPaymentsFilter() {
      return {
        sellable_type: "subscriptions",
        ...this.pureFilter
      };
    },
    subscriptionsPayments() {
      return this.$store.getters["payments/where"]({
        filter: this.subscriptionsPaymentsFilter
      });
    },
    calculateSum() {
      const payments = _.concat(this.barPayments, this.subscriptionsPayments);
      const result = {
        bar: {
          cash: 0,
          card: 0,
          transfer: 0,
          total: 0
        },
        subscriptions: {
          cash: 0,
          card: 0,
          transfer: 0,
          total: 0
        },
        total: {
          cash: 0,
          card: 0,
          transfer: 0,
          total: 0
        }
      };
      for (let i = 0; i < payments.length; i++) {
        const cost = parseFloat(payments[i].cost * payments[i].quantity);
        console.log("cost of iteration" + cost);
        switch (payments[i].sellable_type) {
          case "bar-items":
            switch (payments[i].method) {
              case "cash":
                result.bar.cash += cost;
                break;
              case "card":
                result.bar.card += cost;
                break;
              case "transfer":
                result.bar.transfer += cost;
                break;
            }
            break;
          case "subscriptions":
            switch (payments[i].method) {
              case "cash":
                result.subscriptions.cash += cost;
                break;
              case "card":
                result.subscriptions.card += cost;
                break;
              case "transfer":
                result.subscriptions.transfer += cost;
                break;
            }
            break;
        }
      }
      result.bar.total =
        result.bar.cash + result.bar.card + result.bar.transfer;
      result.subscriptions.total =
        result.subscriptions.cash +
        result.subscriptions.card +
        result.subscriptions.transfer;
      result.total.cash = result.bar.cash + result.subscriptions.cash;
      result.total.card = result.bar.card + result.subscriptions.card;
      result.total.transfer =
        result.bar.transfer + result.subscriptions.transfer;
      result.total.total = result.bar.total + result.subscriptions.total;
      console.log(result);
      return result;
    }
  },
  methods: {
    loadSubject(payments, type) {
      switch (type) {
        case "bar-items":
          return this.$store
            .dispatch("payments/loadWhere", {
              filter: this.barPaymentsFilter
            })
            .then(() => {
              const barItemsIds = _(
                this.$store.getters["payments/where"]({
                  filter: this.barPaymentsFilter
                })
              )
                .map(payment => payment.sellable_id)
                .uniq()
                .value();

              console.info("Gonna load next sellable ids: " + barItemsIds);

              return Promise.all([
                this.$store.dispatch("bar-items/loadWhere", {
                  filter: {
                    bar_item_id: barItemsIds
                  }
                })
              ]);
            });
        case "training-sessions":
          return this.$store
            .dispatch("payments/loadWhere", {
              filter: this.trainingsPaymentsFilter
            })
            .then(() => {
              const trainingsIds = _(
                this.$store.getters["payments/where"]({
                  filter: this.trainingsPaymentsFilter
                })
              )
                .map(payment => payment.sellable_id)
                .uniq()
                .value();

              return Promise.all([
                this.$store.dispatch("training-sessions/loadWhere", {
                  filter: {
                    training_session_id: trainingsIds
                  }
                })
              ]).then(() => {
                const trainings = this.$store.getters[
                  "training-sessions/where"
                ]({
                  filter: {
                    training_session_id: trainingsIds
                  }
                });
                const clientsIds = _(trainings)
                  .map(training => training.client_id)
                  .uniq()
                  .value();
                const trainersIds = _(trainings)
                  .map(training => training.trainer_id)
                  .uniq()
                  .value();
                return Promise.all([
                  this.$store.dispatch("clients/loadWhere", {
                    filter: {
                      client_id: clientsIds
                    }
                  }),
                  this.$store.dispatch("trainers/loadWhere", {
                    filter: {
                      trainer_id: trainersIds
                    }
                  })
                ]);
              });
            });
        case "subscriptions":
          return this.$store
            .dispatch("payments/loadWhere", {
              filter: this.subscriptionsPaymentsFilter
            })
            .then(() => {
              const subscriptionsIds = _(
                this.$store.getters["payments/where"]({
                  filter: this.subscriptionsPaymentsFilter
                })
              )
                .map(payment => payment.sellable_id)
                .uniq()
                .value();

              console.info("Gonna load next sellable ids: " + subscriptionsIds);

              return Promise.all([
                this.$store.dispatch("subscriptions/loadWhere", {
                  filter: {
                    subscription_id: subscriptionsIds
                  }
                })
              ]).then(() => {
                const subscriptions = this.$store.getters[
                  "subscriptions/where"
                ]({
                  filter: {
                    subscription_id: subscriptionsIds
                  }
                });
                const clientsIds = _(subscriptions)
                  .map(subscription => subscription.client_id)
                  .uniq()
                  .value();
                const groupsIds = _(subscriptions)
                  .filter({ subscriable_type: "groups" })
                  .map(subscription => subscription.subscriable_id)
                  .uniq()
                  .value();
                console.info("Gonna load next sellable ids: " + clientsIds);
                return Promise.all([
                  this.$store.dispatch("clients/loadWhere", {
                    filter: {
                      client_id: clientsIds
                    }
                  }),
                  this.$store.dispatch("groups/loadWhere", {
                    filter: {
                      group_id: groupsIds
                    }
                  })
                ]);
              });
            });
      }
    },

    loadPayments() {
      this.$store
        .dispatch("payments/loadPage", {
          options: {
            page: -1
          }
        })
        .then(async () => {
          const payments = this.$store.getters["payments/page"];
          return await Promise.all(
            _(payments)
              .groupBy("sellable_type")
              .map(
                async (payments, type) => await this.loadSubject(payments, type)
              )
              .value()
          );
        });
    }
  }
};
