<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn outlined class="mr-4" @click="setToday">
            Сегодня
          </v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <div class="flex-grow-1" />
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(value, key) in typeToLabel"
                :key="key"
                @click="type = key"
              >
                <v-list-item-title>{{ value }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="430">
        <v-calendar
          ref="calendar"
          v-model="focus"
          :events="events"
          event-start="start_date"
          event-end="end_date"
          locale="ru"
          :interval-format="interval => interval.time"
          first-interval="8"
          interval-count="16"
          :event-margin-bottom="3"
          :now="today"
          :type="type"
          @change="updateRange"
        />
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "GroupEventCalendar",

  props: {
    group: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    focus: "2019-01-01",

    start: null,
    end: null,

    type: "month",
    typeToLabel: {
      month: "Месяц",
      week: "Неделя",
      "4day": "4 Дня",
      day: "День"
    },

    events: []
  }),

  computed: {
    today() {
      return this.$moment().format("YYYY-MM-DD");
    },

    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }

      const startDay = start.day;
      const endDay = end.day;

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const prefixMonth = startMonth === endMonth ? "" : startMonth;

      const startYear = start.year;
      const endYear = end.year;
      const prefixYear = startYear === endYear ? "" : startYear;

      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`; // октябрь 2019
        case "week": // 28 сентября - 5 октября 2019, 28 декабря 2018 - 12 января 2019
        case "4day": // 12 - 16  октября 2019
          return `${startDay} ${prefixMonth} ${prefixYear} - ${endDay} ${endMonth} ${endYear}`;
        case "day":
          return `${startDay} ${startMonth} ${startYear}`;
      }
      return "";
    },

    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    }
  },

  mounted() {
    this.focus = this.today;

    this.loadEvents({
      start: this.$moment().format("YYYY-MM-DD hh:mm"),
      end: this.$moment()
        .add(1, "month")
        .format("YYYY-MM-DD hh:mm")
    });
  },

  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },

    setToday() {
      this.focus = this.today;
    },

    prev() {
      this.$refs.calendar.prev();
    },

    next() {
      this.$refs.calendar.next();
    },

    updateRange(range) {
      const { start, end } = range;

      console.log(range);

      // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
      this.start = start;
      this.end = end;

      this.loadEvents({
        start: start.date,
        end: end.date
      });
    },

    loadEvents({ start, end }) {
      return this.$axios
        .get("groups/" + this.group.id + "/events", {
          params: {
            start_date: start,
            end_date: end,
            limit: ""
          }
        })
        .then(response => {
          this.events = response.data.data.map(event => ({
            name: this.group.title,
            start_date: event.start_date,
            end_date: event.end_date
            // start_date: this.$moment(event.start_date).format('YYYY-MM-DD hh:mm'),
            // end_date: this.$moment(event.end_date).format('YYYY-MM-DD hh:mm'),
          }));
        });
    }
  }
};
</script>

<style scoped></style>
