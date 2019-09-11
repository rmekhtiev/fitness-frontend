import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n);

export default ({app, store}) => {
  app.i18n = new VueI18n({
    locale: 'ru',
    fallbackLocale: 'en',
    messages: {
      "ru": {
        "activity": {
          "clients": {
            "created": "Новый клиент: {client}",
          },

          "locker-claims": {
            "created": "Клиент {client} забронировал шкафчик {locker} на {duration}",
          },

          "issues": {
            "created": "Новая проблема в зале {hall}",
          },

        },
        "statuses": {
          "all": {
            "pending": "В ожидании",
            "in-work": "Выполняется",
            "ready": "Готово",
          },
        },
      },
    },
  });
}
