<template>
  <div id="training-session">
    <v-layout row wrap>
      <v-flex xs12 sm6 lg4 xl3>
        <training-session-info-card
          :session="session"
          @update="loadTrainingSession"
          class="mb-2 mx-auto"
        />
      </v-flex>
      <v-flex xs12 sm6 lg4 xl3>
        <v-card class="mb-2 mx-auto">
          <v-card-text>
            <div class="overline">
              Расписание
            </div>
          </v-card-text>

          <v-list v-if="loading.schedules || schedules.length > 0">
            <v-skeleton-loader
              v-if="loading.schedules"
              type="list-item-two-line, list-item-two-line"
            />
            <schedule-mini-list-item
              v-else
              v-for="(schedule, index) in schedules"
              :key="'schedule-' + index"
              :schedule="schedule"
            />
          </v-list>
          <v-card-text v-else class="text-center">
            <v-icon style="font-size: 4rem">mdi-inbox</v-icon>
            <br />
            Пусто
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-speed-dial v-model="fab" fixed bottom right>
      <template v-slot:activator>
        <v-btn v-model="fab" color="primary" dark fab>
          <v-icon v-if="fab">
            mdi-close
          </v-icon>
          <v-icon v-else>
            mdi-plus
          </v-icon>
        </v-btn>
      </template>
      <v-tooltip :value="tooltips" left>
        <template v-slot:activator="{ on }">
          <v-btn
            @click.native="openScheduleDialog"
            fab
            dark
            small
            color="green"
          >
            <v-icon>mdi-calendar</v-icon>
          </v-btn>
        </template>
        <span>Занятие</span>
      </v-tooltip>
    </v-speed-dial>

    <schedule-dialog
      ref="scheduleDialog"
      :trainers="$store.getters['trainers/all']"
      :default="{ trainer_id: session.trainer_id }"
      title="Создать тренировку"
    />
  </div>
</template>

<script>
import TrainingSessionInfoCard from "../../components/training-sessions/TrainingSessionInfoCard";
import ScheduleMiniListItem from "../../components/schedule/ScheduleMiniListItem";

import fabWithTooltips from "../../mixins/fab-with-tooltips";
import ScheduleDialog from "../../components/schedule/ScheduleDialog";

export default {
  components: {
    ScheduleDialog,
    ScheduleMiniListItem,
    TrainingSessionInfoCard
  },

  mixins: [fabWithTooltips],

  data: () => ({
    loading: {
      schedules: true
    }
  }),

  computed: {
    session() {
      return this.$store.getters["training-sessions/byId"]({
        id: this.$route.params.id
      });
    },

    schedulesFilter() {
      return {
        schedulable_type: "training-sessions",
        schedulable_id: this.session.id
      };
    },

    schedules() {
      return this.$store.getters["schedules/where"]({
        filter: this.schedulesFilter
      });
    }
  },

  fetch: ({ store, params }) => {
    return store.dispatch("training-sessions/loadById", {
      id: params.id
    });
  },

  mounted() {
    return this.loadRelated();
  },

  methods: {
    loadTrainingSession() {
      return this.$store.dispatch("training-sessions/loadById", {
        id: this.$route.params.id
      });
    },

    loadRelated() {
      return Promise.all([
        this.loadClient(),
        this.loadTrainer(),
        this.loadTrainers(),
        this.loadSchedules()
      ]);
    },

    loadClient() {
      return this.$store.dispatch("clients/loadById", {
        id: this.session.client_id
      });
    },

    loadTrainer() {
      return this.$store.dispatch("trainers/loadById", {
        id: this.session.trainer_id
      });
    },

    loadTrainers() {
      this.loading.allTrainers = true;

      return this.$store
        .dispatch("trainers/loadAll", {
          params: {
            per_page: -1
          }
        })
        .then(() => {
          this.loading.allTrainers = false;
        });
    },

    loadSchedules() {
      this.loading.schedules = true;

      return this.$store
        .dispatch("schedules/loadWhere", {
          filter: this.schedulesFilter,
          params: {
            per_page: -1
          }
        })
        .then(() => {
          this.loading.schedules = false;
        });
    },

    openScheduleDialog() {
      this.$refs.scheduleDialog.open().then(form => {
        form.schedulable_type = "training-sessions";
        form.schedulable_id = this.$route.params.id;

        this.$axios.post("schedules", form).then(() => this.loadSchedules());
      });
    }
  }
};
</script>

<style scoped></style>
