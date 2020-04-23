import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

export default ({ app }) => {
  app.i18n = new VueI18n({
    locale: "ru",
    fallbackLocale: "en",
    messages: {
      ru: {
        activity: {
          clients: {
            created: "Новый клиент: {client}"
          },

          "locker-claims": {
            created:
              "Клиент {client} забронировал шкафчик {locker} на {duration}"
          },

          issues: {
            created: "Новая проблема в зале {hall}: {issue}"
          },

          "client-group": {
            created: "Клиент {client} записан в группу {group}",
            deleted: "Клиент {client} убран из группы {group}"
          }
        },
        statuses: {
          all: {
            pending: "В ожидании",
            "in-work": "Выполняется",
            ready: "Готово"
          }
        },
        questionnaire_statuses: {
          filled: "Заполнена",
          unfilled: "Не заполнена",
        },
        prefers: {
          gym: "Тренировки в зале",
          straiting: "Стретчинг",
          personal: "Персональные тренировки",
          single: "Разовые тренировки"
        },
        free_training_statuses: {
          expired: "Просрочена",
          used: "Проведена",
          not_scheduled: "Не назначена",
          available: "Доступна для проведения"
        },
        users: {
          primary_role: {
            name: {
              owner: "Владелец",
              hall_admin: "Администратор зала",
              concierge: "Консьерж"
            }
          }
        },
        schedule: {
          repeat: {
            weekly: "Еженедельно"
          }
        },
        methods: {
          cash: "Наличные",
          card: "По карте",
          transfer: "Переводом",
          total: "Всего"
        },
        categories: {
          subscriptions: "Абонементы",
          "bar-items": "Бар",
          "training-sessions": "Тренировки",
          total: "Всего"
        }
      }
    }
  });
};
