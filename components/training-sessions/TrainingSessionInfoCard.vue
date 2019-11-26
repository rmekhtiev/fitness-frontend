<template>
  <v-card class="mb-2 mx-auto">
    <v-card-text>
      <div class="overline">
        Индивидуальные тренировки
      </div>
    </v-card-text>

    <v-list two-line>
      <v-skeleton-loader :loading="!trainer" type="list-item-two-line">
        <v-list-item
          :to="{ name: 'trainers-id', params: { id: session.trainer_id } }"
        >
          <v-list-item-content>
            <v-list-item-subtitle class="caption">Тренер</v-list-item-subtitle>
            <v-list-item-title v-if="trainer">
              {{ trainer.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-skeleton-loader>

      <v-list-item
        :to="{ name: 'training-sessions-id', params: { id: session.id } }"
        active-class="none"
      >
        <v-list-item-content>
          <v-list-item-subtitle class="caption">
            Оставшиеся занятия
          </v-list-item-subtitle>
          <v-list-item-title>
            <span>{{ session.count - session.past_events_count }}</span>
            <span class="grey--text"> / </span>
            <span class="grey--text">{{ session.count }}</span>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon>mdi-pencil</v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-card-actions>
      <v-spacer />
      <v-menu v-if="!session.sold" bottom left>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" text color="red">
            Оформить продажу
          </v-btn>
        </template>

        <v-list dense flat>
          <v-list-item
            v-for="method in ['cash', 'transfer', 'card']"
            @click="sellTrainingSession(session, method)"
          >
            <v-list-item-icon>
              <v-icon>mdi-cash-usd-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="pr-6">
              <v-list-item-title>
                {{ $t("methods." + method) }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-actions>
  </v-card>
</template>

<script>
import trainingSessionsMixin from "../../mixins/trainingSessions";

export default {
  name: "TrainingSessionInfoCard",

  mixins: [trainingSessionsMixin],

  props: {
    session: {
      type: Object,
      required: true
    }
  },

  computed: {
    trainer() {
      return this.$store.getters["trainers/byId"]({
        id: this.session.trainer_id
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.v-list-item--active {
  &.none {
    &::before {
      opacity: 0;
    }
  }
}
</style>
