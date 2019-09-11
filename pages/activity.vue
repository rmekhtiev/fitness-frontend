<template>
  <div id="lockers">
    <v-timeline dense clipped>
      <template
        v-for="(activitiesGroup, index) in groupedActivities">
        <v-timeline-item
          class="mb-6"
          hide-dot
        >
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <span class="text-uppercase" v-on="on">{{ humanizeDaysDiff(index) }}</span>
            </template>
            <span>{{ $moment().subtract(index, 'd').format('LL') }}</span>
          </v-tooltip>
        </v-timeline-item>

        <v-timeline-item
          v-for="(activity, index) in activitiesGroup"
          class="mb-4"
          color="primary"
          small
        >
          <v-row justify="space-between" class="mr-0">
            <v-col cols="7">
              {{ activity.subject_type + '.' + activity.description }}
            </v-col>
            <v-col class="text-right" cols="5">
              <v-tooltip bottom nudge-left="15">
                <template v-slot:activator="{ on }">
                  <span v-on="on">{{ $moment(activity.created_at).format('LT') }}</span>
                </template>
                <span>{{ $moment(activity.created_at).format('lll') }}</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-timeline-item>
      </template>
    </v-timeline>
  </div>
</template>

<script>
    import _ from 'lodash'

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
