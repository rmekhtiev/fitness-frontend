<template>
  <div id="lockers" v-infinite-scroll="loadMore">
    <v-timeline dense clipped>
      <template v-if="activities.length === 0">
        <v-timeline-item v-for="index in 5" :key="index" small class="mb-6">
          <v-skeleton-loader type="list-item-two-line" />
        </v-timeline-item>
      </template>

      <template v-for="(activitiesGroup, days) in groupedActivities">
        <v-timeline-item class="mb-6" hide-dot>
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <span class="text-uppercase" v-on="on">{{
                humanizeDaysDiff(days)
              }}</span>
            </template>
            <span>{{
              $moment()
                .subtract(days, "d")
                .format("LL")
            }}</span>
          </v-tooltip>
        </v-timeline-item>

        <component
          :is="activityComponent(activity.subject_type)"
          v-for="(activity, index) in activitiesGroup"
          :key="'activity-' + index + '-day-' + days"
          :activity="activity"
        />
      </template>
    </v-timeline>
  </div>
</template>

<script>
import _ from "lodash";

import infiniteScroll from "vue-infinite-scroll";

import DefaultActivityItem from "../components/activity/DefaultActivityItem";
import LockerClaimActivityItem from "../components/activity/LockerClaimActivityItem";
import ClientActivityItem from "../components/activity/ClientActivityItem";
import IssueActivityItem from "../components/activity/IssueActivityItem";
import ClientGroupActivityItem from "../components/activity/ClientGroupActivityItem";

function isToday(momentDate, reference) {
  const today = reference.clone().startOf("day");
  return momentDate.isSame(today, "d");
}

function isYesterday(momentDate, reference) {
  const yesterday = reference
    .clone()
    .subtract(1, "days")
    .startOf("day");
  return momentDate.isSame(yesterday, "d");
}

function isWithinAWeek(momentDate, reference) {
  return momentDate.isAfter(
    reference
      .clone()
      .startOf("week")
      .startOf("day")
  );
}

// eslint-disable-next-line no-unused-vars
function isTwoWeeksOrMore(momentDate, reference) {
  return !isWithinAWeek(momentDate, reference);
}

function loadSubject(activities, type, store) {
  const chunks = _(activities).chunk(10);

  switch (type) {
    case "client-group":
      return Promise.all(
        chunks
          .map(chunk =>
            Promise.all([
              store.dispatch("clients/loadWhere", {
                filter: {
                  id: _(chunk)
                    .map(activity => activity.properties.client_id)
                    .uniq()
                    .value()
                }
              }),
              store.dispatch("groups/loadWhere", {
                filter: {
                  id: _(chunk)
                    .map(activity => activity.properties.group_id)
                    .uniq()
                    .value()
                }
              })
            ])
          )
          .value()
      );
    default:
      return Promise.all(
        chunks
          .map(chunk => {
            return store
              .dispatch(type + "/loadWhere", {
                filter: {
                  id: _(chunk)
                    .map(activity => activity.subject_id)
                    .uniq()
                    .value()
                }
              })
              .then(async () => await loadRelated(chunk, type, store));
          })
          .value()
      );
  }
}

function loadRelated(activities, type, store) {
  const subjectIds = _(activities)
    .map(activity => activity.subject_id)
    .uniq();
  const subjects = store.getters[type + "/all"].filter(subject =>
    subjectIds.includes(subject.id)
  );

  switch (type) {
    case "locker-claims":
      return Promise.all([
        store.dispatch("lockers/loadWhere", {
          filter: {
            id: _(subjects)
              .map(claim => claim.locker_id)
              .uniq()
              .value()
          }
        }),
        store.dispatch("clients/loadWhere", {
          filter: {
            id: _(subjects)
              .map(claim => claim.client_id)
              .uniq()
              .value()
          }
        })
      ]);
  }
}

export default {
  head() {
    return {
      title: "Журнал"
    };
  },

  directives: {
    infiniteScroll
  },

  components: {
    DefaultActivityItem
  },

  computed: {
    activities() {
      return this.$store.getters.selectedHall
        ? _.filter(
            this.$store.getters["activities/all"],
            item => item.hall_id === this.$store.getters.selectedHallIdForFilter
          )
        : this.$store.getters["activities/all"];
    },

    groupedActivities() {
      return _(this.activities)
        .groupBy(activity =>
          this.$moment().diff(
            this.$moment(activity.created_at).startOf("day"),
            "day"
          )
        )
        .value();
    }
  },

  fetch({ store }) {
    return Promise.all([store.dispatch("halls/loadAll")]);
  },

  methods: {
    humanizeDaysDiff(days) {
      const target = this.$moment().subtract(days, "d");
      const today = this.$moment();

      if (isToday(target, today)) {
        return "Сегодня";
      } else if (isYesterday(target, today)) {
        return "Вчера";
      } else if (isWithinAWeek(target, today)) {
        return target.format("dddd");
      } else {
        return target.format("ll");
      }
    },

    activityComponent(subject) {
      switch (subject) {
        case "clients":
          return ClientActivityItem;
        case "client-group":
          return ClientGroupActivityItem;
        case "locker-claims":
          return LockerClaimActivityItem;
        case "issues":
          return IssueActivityItem;
        default:
          return DefaultActivityItem;
      }
    },

    loadMore() {
      return this.$store.dispatch("activities/loadNextPage").then(async () => {
        const activities = this.$store.getters["activities/page"];

        return await Promise.all(
          _(activities)
            .groupBy("subject_type")
            .map(
              async (activities, type) =>
                await loadSubject(activities, type, this.$store)
            )
            .value()
        );
      });
    }
  }
};
</script>

<style scoped></style>
