<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12 sm6 lg4 xl3>
        <trainer-info-card :trainer="trainer" class="mb-2 mx-auto" />
      </v-flex>

      <v-flex xs12 lg6 xl4>
        <v-card class="mb-2 mx-auto">
          <event-calendar
            v-model="calendarRange"
            :events="events"
            :type.sync="calendarType"
            :calendar-props="calendarProps"
            :calendar-events="calendarEvents"
          />
        </v-card>
      </v-flex>

      <v-flex xs12 sm6 lg4 xl3>
        <!-- Training sessions -->
        <training-session-info-card
          v-for="(session, index) in trainingSessions"
          :key="'training-session' + index"
          :session="session"
          display-client
          @update="loadTrainingSessions"
        />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import _ from "lodash";
import TrainerInfoCard from "../../components/trainers/TrainerInfoCard";
import TrainingSessionInfoCard from "../../components/training-sessions/TrainingSessionInfoCard";
import EventCalendar from "../../components/EventCalendar";

export default {
  // head() {
  //   return {
  //     title: this.trainer.name
  //   };
  // },

  components: {
    EventCalendar,
    TrainingSessionInfoCard,
    TrainerInfoCard
  },

  data: () => ({
    loading: {},
    events: [],
    calendarType: "week",
    calendarRange: {}
  }),

  computed: {
    trainer() {
      return this.$store.getters["trainers/byId"]({
        id: this.$route.params.id
      });
    },

    trainingSessionsFilter() {
      return {
        trainer_id: this.$route.params.id,
        active: true
      };
    },

    trainingSessions() {
      return this.$store.getters["training-sessions/where"]({
        filter: this.trainingSessionsFilter
      });
    },

    calendarProps() {
      return {
        locale: "ru",
        firstInterval: "8",
        intervalCount: "16",
        eventStart: "start_date",
        eventEnd: "end_date",
        intervalFormat: interval => interval.time,
        weekdays: [1, 2, 3, 4, 5, 6, 0]
      };
    },
    calendarEvents() {
      return {
        "click:time"(val) {
          console.log(val);
        },
        "click:event"({ nativeEvent, event }) {
          // this.showEvent();
        }
      };
    }
  },

  watch: {
    calendarRange(range) {
      this.loadEvents(range);
    }
  },

  fetch({ store, params }) {
    return Promise.all([
      store.dispatch("trainers/loadById", { id: params.id }).then(
        async () =>
          // eslint-disable-next-line no-return-await
          await store.dispatch("employees/loadById", {
            id: store.getters["trainers/byId"]({ id: params.id })
              .associated_employee_id
          })
      ),
      store.dispatch("halls/loadAll")
    ]);
  },

  mounted() {
    return Promise.all([this.loadTrainingSessions()]);
  },

  methods: {
    loadTrainingSessions() {
      this.loading.trainingSessions = true;

      return this.$store
        .dispatch("training-sessions/loadWhere", {
          filter: this.trainingSessionsFilter
        })
        .then(() => {
          this.loading.trainingSessions = false;
        });
    },
    loadEvents({ start, end }) {
      this.loading.events = true;

      return this.$axios
        .get("trainers/" + this.$route.params.id + "/events", {
          params: {
            start_date: start.date,
            end_date: end.date,
            limit: ""
          }
        })
        .then(async response => {
          const events = response.data.data;
          await this.loadEventsSubjects(events);

          this.events = events.map(event => {
            const subject = this.$store.getters[
              event.schedulable_type + "/byId"
            ]({
              id: event.schedulable_id
            });
            return {
              start_date: event.start_date,
              end_date: event.end_date,
              name: subject.title
            };
          });
        });
    },
    loadEventsSubjects(events) {
      return Promise.all(
        _(events)
          .groupBy("schedulable_type")
          .map(this.loadSubject)
          .value()
      );
    },
    loadSubject(events, type) {
      return Promise.all(
        _(events)
          .chunk(10)
          .map(chunk =>
            this.$store.dispatch(type + "/loadWhere", {
              filter: {
                id: _(chunk)
                  .map(event => event.schedulable_id)
                  .uniq()
                  .value()
              }
            })
          )
          .value()
      );
    }
  }
};
</script>

<style scoped></style>
