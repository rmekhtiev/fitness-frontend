<template>
  <div>
    <v-list dense nav>
      <v-list-item
        v-for="item in mainActions"
        :key="item.title"
        link
        nuxt
        :to="item.to"
        exact
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-list dense nav subheader>
      <v-subheader>Зал</v-subheader>

      <template v-for="item in hallActions">
        <v-list-group
          v-if="item.items"
          :key="item.title"
          :prepend-icon="item.icon"
        >
          <template v-slot:activator>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </template>

          <v-list-item
            v-for="subItem in item.items"
            :key="subItem.title"
            link
            nuxt
            :to="{ name: subItem.to, params: subItem.params }"
            exact
          >
            <v-list-item-icon />

            <v-list-item-content>
              <v-list-item-title>{{ subItem.title }}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-icon>
              <v-icon>{{ subItem.icon }}</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
        <v-list-item v-else :key="item.title" link nuxt :to="item.to" exact>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>

    <template v-if="isOwner">
      <v-divider />

      <v-list dense nav subheader>
        <v-subheader>Управление</v-subheader>

        <v-list-item
          v-for="item in adminActions"
          :key="item.title"
          link
          nuxt
          :to="item.to"
          exact
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
    <template v-if="isHallAdmin">
      <v-divider />

      <v-list dense nav subheader>
        <v-subheader>Статистика</v-subheader>

        <v-list-item
          v-if="hall"
          :key="hall.title"
          link
          nuxt
          :to="{ name: 'halls-id', params: { id: hall.id } }"
          exact
        >
          <v-list-item-icon>
            <v-icon>mdi-domain</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ hall.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </div>
</template>

<script>
import auth from "../../../mixins/auth";
import selectedHallAware from "../../../mixins/selected-hall-aware";

export default {
  mixins: [auth, selectedHallAware],

  data: () => ({
    mainActions: [
      { title: "Главная", icon: "mdi-home-outline", to: { name: "index" } },
      {
        title: "Журнал",
        icon: "mdi-calendar-check-outline",
        to: { name: "activity" }
      }
    ],

    hallActions: [
      {
        title: "Клиенты",
        icon: "mdi-account-multiple-outline",
        to: { name: "clients" }
      },
      {
        title: "Индивидуальные занятия",
        icon: "mdi-account-multiple-outline",
        to: { name: "training-sessions" }
      },
      {
        title: "Шкафчики",
        icon: "mdi-locker-multiple",
        to: { name: "lockers" }
      },
      {
        title: "Сотрудники",
        icon: "mdi-account-badge-horizontal-outline",
        to: { name: "employees" }
      },
      { title: "Тренеры", icon: "mdi-account-star", to: { name: "trainers" } },
      { title: "Группы", icon: "mdi-account-group", to: { name: "groups" } },
      {
        title: "Проблемы",
        icon: "mdi-clipboard-alert",
        to: { name: "issues" }
      },
      { title: "Бар", icon: "mdi-bottle-soda", to: { name: "bar-items" } }
    ],

    adminActions: [
      { title: "Залы", icon: "mdi-domain", to: { name: "halls" } },
      {
        title: "Пользователи",
        icon: "mdi-account-card-details",
        to: { name: "users" }
      },
      { title: "Заявки", icon: "mdi-phone", to: { name: "requests" } }
    ]
  }),

  computed: {
    hall() {
      return this.$store.getters["halls/byId"]({ id: this.selectedHallId });
    }
  }
};
</script>

<style scoped></style>
