<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn outlined class="mr-4" @click="focus = today">
            Сегодня
          </v-btn>
          <v-btn fab text small @click="$refs.calendar.prev()">
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn fab text small @click="$refs.calendar.next()">
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <div class="flex-grow-1" />
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined v-on="on">
                <span>{{ intervals[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(intervalTitle, interval) in intervals"
                :key="interval"
                @click="() => $emit('update:type', interval)"
              >
                <v-list-item-title>{{ intervalTitle }}</v-list-item-title>
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
          :type="type"
          v-bind="calendarProps"
          :now="today"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="range => $emit('input', range)"
          v-on="calendarEvents"
        />
<!--        <v-menu-->
<!--          v-model="selectedOpen"-->
<!--          :close-on-content-click="false"-->
<!--          :activator="selectedElement"-->
<!--          full-width-->
<!--          offset-x-->
<!--        >-->
<!--          <slot name="eventSelection"></slot>-->
<!--        </v-menu>-->
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "EventCalendar",
  props: {
    value: {
      type: Object,
      default: () => ({
        start: "",
        end: ""
      })
    },
    events: {
      type: Array,
      default: () => []
    },
    calendarProps: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: "month"
    },
    intervals: {
      type: Object,
      default: () => ({
        month: "Месяц",
        week: "Неделя",
        "4day": "4 Дня",
        day: "День"
      })
    },
    calendarEvents: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    focus: ""
  }),
  computed: {
    today() {
      return this.$moment().format("YYYY-MM-DD");
    },
    title() {
      const { start, end } = this.value;
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
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.$emit("update:type", "day");
    }
  }
};
</script>

<style scoped></style>
