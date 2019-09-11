<template>
  <div id="lockers">
    <v-timeline dense clipped>
      <template
        v-for="(activitiesGroup, days) in groupedActivities">
        <v-timeline-item
          class="mb-6"
          hide-dot
        >
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <span class="text-uppercase" v-on="on">{{ humanizeDaysDiff(days) }}</span>
            </template>
            <span>{{ $moment().subtract(days, 'd').format('LL') }}</span>
          </v-tooltip>
        </v-timeline-item>

        <component
          v-for="(activity, index) in activitiesGroup"
          :key="'activity-' + index + '-day-' + days"
          :is="activityComponent(activity.subject_type)"
          :activity="activity">

        </component>
      </template>
    </v-timeline>
  </div>
</template>

<script>
    import _ from 'lodash'

    import DefaultActivityItem from "../components/activity/DefaultActivityItem";
    import ClientActivityItem from "../components/activity/ClientActivityItem";

    function isToday(momentDate, reference) {
        let today = reference.clone().startOf('day');
        return momentDate.isSame(today, 'd');
    }

    function isYesterday(momentDate, reference) {
        let yesterday = reference.clone().subtract(1, 'days').startOf('day');
        return momentDate.isSame(yesterday, 'd');
    }

    function isWithinAWeek(momentDate, reference) {
        return momentDate.isAfter(reference.clone().startOf('week').startOf('day'));
    }

    function isTwoWeeksOrMore(momentDate, reference) {
        return !isWithinAWeek(momentDate, reference);
    }

    export default {
        computed: {
            activities() {
                return this.$store.getters['selectedHall']
                    ? _.filter(this.$store.getters['activities/all'], item => (item.hall_id === this.$store.getters['selectedHallIdForFilter']))
                    : this.$store.getters['activities/all'];
            },

            groupedActivities() {
                return _(this.activities)
                    .mapKeys(activity => activity.created_at)
                    .groupBy(activity => this.$moment().diff(this.$moment(activity.created_at), 'day'))
                    .value()
            },
        },

        methods: {
            humanizeDaysDiff(days) {
                let target = this.$moment().subtract(days, 'd');
                let today = this.$moment();

                if(isToday(target, today)) {
                    return 'Сегодня';
                } else if(isYesterday(target, today)) {
                    return 'Вчера';
                } else if(isWithinAWeek(target, today)) {
                    return target.format('dddd');
                } else {
                    return target.format('ll');
                }
            },

            activityComponent(subject) {
                switch (subject) {
                    case 'clients':
                        return ClientActivityItem;
                    default:
                        return DefaultActivityItem;
                }
            }
        },

        fetch({store}) {
            return Promise.all([
                store.dispatch('activities/loadAll'),
            ]);
        },
    }
</script>

<style scoped>

</style>
