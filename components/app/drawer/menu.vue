<template>
  <div>
    <v-list dense nav>
      <v-list-item
        v-for="item in mainActions"
        :key="item.title"
        link nuxt :to="item.to" exact
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list dense nav subheader>
      <v-subheader>Зал</v-subheader>

      <v-list-item
        v-for="item in hallActions"
        :key="item.title"
        link nuxt :to="item.to" exact
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-if="isOwner">
      <v-divider></v-divider>

      <v-list dense nav subheader>
        <v-subheader>Управление</v-subheader>

        <v-list-item
          v-for="item in adminActions"
          :key="item.title"
          link nuxt :to="item.to" exact
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
  </div>
</template>

<script>
    import auth from '../../../mixins/auth'

    export default {
        mixins: [
            auth,
        ],

        data: () => ({
            mainActions: [
                {title: 'Главная', icon: 'mdi-home-outline', to: {name: 'index'}},
                {title: 'Журнал', icon: 'mdi-calendar-check-outline', to: {name: 'activity'}},
            ],

            hallActions: [
                {title: 'Клиенты', icon: 'mdi-account-multiple-outline', to: {name: 'clients'}},
                {title: 'Шкафчики', icon: 'mdi-locker-multiple', to: {name: 'lockers'}},
                {title: 'Сотрудники', icon: 'mdi-account-badge-horizontal-outline', to: {name: 'employees'}},
                {title: 'Тренеры', icon: 'mdi-account-star', to: {name: 'trainers'}},
                {title: 'Группы', icon: 'mdi-account-group', to: {name: 'groups'}},
                {title: 'Проблемы', icon: 'mdi-clipboard-alert', to: {name: 'issues'}},
            ],

            adminActions: [
                {title: 'Залы', icon: 'mdi-domain', to: {name: 'halls'}},
            ],
        }),
    }
</script>

<style scoped>

</style>
