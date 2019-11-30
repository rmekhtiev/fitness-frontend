<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12 sm6 lg4 xl3>
        <trainer-info-card :trainer="trainer" class="mb-2 mx-auto" />

        <!-- Training sessions -->
        <training-session-info-card
          v-for="(session, index) in trainingSessions"
          :key="'training-session' + index"
          :session="session"
          display-client
          @update="loadTrainingSessions"
        />
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

          <!--          <v-menu-->
          <!--            v-model="selectedOpen"-->
          <!--            :close-on-content-click="false"-->
          <!--            :activator="selectedElement"-->
          <!--            offset-x-->
          <!--          >-->
          <!--            <v-card color="grey lighten-4" min-width="350px" flat>-->
          <!--              <v-toolbar :color="selectedEvent.color" dark>-->
          <!--                <v-btn icon>-->
          <!--                  <v-icon>mdi-calendar</v-icon>-->
          <!--                </v-btn>-->
          <!--                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>-->
          <!--                <v-spacer></v-spacer>-->
          <!--                <v-btn icon>-->
          <!--                  <v-icon>mdi-heart</v-icon>-->
          <!--                </v-btn>-->
          <!--                <v-btn icon>-->
          <!--                  <v-icon>mdi-dots-vertical</v-icon>-->
          <!--                </v-btn>-->
          <!--              </v-toolbar>-->
          <!--              <v-card-text>-->
          <!--                <span v-html="selectedEvent.details"></span>-->
          <!--              </v-card-text>-->
          <!--              <v-card-actions>-->
          <!--                <v-btn text color="secondary" @click="selectedOpen = false">-->
          <!--                  Cancel-->
          <!--                </v-btn>-->
          <!--              </v-card-actions>-->
          <!--            </v-card>-->
          <!--          </v-menu>-->
        </v-card>
      </v-flex>

      <v-flex xs12 sm6 lg4 xl3> </v-flex>
    </v-layout>

    <event-dialog
      ref="eventDialog"
      :sessions="sessionsForDate"
      :default="{ trainer_id: $route.params.id }"
      title="Создать тренировку"
    />
  </div>
</template>

<script>
import _ from "lodash";
import TrainerInfoCard from "../../components/trainers/TrainerInfoCard";
import TrainingSessionInfoCard from "../../components/training-sessions/TrainingSessionInfoCard";
import EventCalendar from "../../components/calendar/EventCalendar";
import EventDialog from "../../components/calendar/EventDialog";

export default {
  // head() {
  //   return {
  //     title: this.trainer.name
  //   };
  // },

  components: {
    EventDialog,
    EventCalendar,
    TrainingSessionInfoCard,
    TrainerInfoCard
  },

  data: () => ({
    loading: {},
    events: [],
    calendarType: "week",
    calendarRange: {},

    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,

    sessionsForDate: []
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
        firstInterval: "7",
        intervalCount: "17",
        eventStart: "start_date",
        eventEnd: "end_date",
        intervalFormat: interval => interval.time,
        weekdays: [1, 2, 3, 4, 5, 6, 0]
      };
    },

    calendarEvents() {
      return {
        "click:time": val => this.createEvent(val),
        "click:event": _event => this.openEvent(_event)
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
          this.loadClients();
        });
    },

    loadClients() {
      this.loading.clients = true;

      return this.$store
        .dispatch("clients/loadWhere", {
          filter: {
            id: this.trainingSessions.map(session => session.client_id)
          }
        })
        .then(() => {
          this.loading.clients = false;
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
            // eslint-disable-next-line standard/computed-property-even-spacing
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
    },

    openEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },

    createEvent(input) {
      const moment = this.$moment(input.date + " " + input.time);
      const remainder = moment.minute() % 30;
      const rounded = this.$moment(moment)
        .subtract(remainder, "minutes")
        .format("YYYY-MM-DD HH:mm");

      const filter = {
        trainer_id: this.$route.params.id,
        after: input.date,
        before: input.date
      };

      this.$store
        .dispatch("training-sessions/loadWhere", {
          filter,
          params: {
            per_page: -1
          }
        })
        .then(() => {
          this.sessionsForDate = this.$store.getters["training-sessions/where"](
            {
              filter
            }
          );
        });

      // console.log({
      //   input,
      //   moment: moment.format("YYYY-MM-DD HH:mm"),
      //   remainder,
      //   rounded
      // });

      this.$refs.eventDialog.open({ startDate: rounded }).then(form => {
        form.schedulable_type = "training-sessions";

        this.$axios.post("schedules", form).then(() => {
          this.loadTrainingSessions();
          this.loadEvents(this.calendarRange);
        });
      });
    }
  }
};
</script>

<style scoped></style>
