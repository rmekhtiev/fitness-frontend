<template>
  <v-layout align-center justify-center column fill-height>
    <div class="text-center mb-5">
      <h1>MULTIPOWER</h1>
      <h3>Система управления сетью Фитнесс-залов</h3>
    </div>
    <div style="width: 100%;">
      <v-layout align-center justify-center>
        <v-flex xs12 md6 lg3>
          <v-card class="elevation-1 pa-3">
            <v-card-text>
              <v-form @submit.prevent="submit">
                <v-text-field
                  v-model="form.email"
                  label="Email"
                  type="email"
                  name="email"
                  autocomplete="username"
                />
                <v-text-field
                  v-model="form.password"
                  :append-icon="
                    password_visible ? 'visibility' : 'visibility_off'
                  "
                  label="Пароль"
                  :type="password_visible ? 'text' : 'password'"
                  name="password"
                  autocomplete="current-password"
                  @click:append="password_visible = !password_visible"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" block @click.prevent="submit">
                Войти
              </v-btn>
            </v-card-actions>
          </v-card>
          <div class="text-xs-center pt-3">
            <!--            <v-btn flat color="primary" :to="{name: 'auth-register'}">Регистрация</v-btn>-->
          </div>
        </v-flex>
      </v-layout>
    </div>
    <div>
      <v-img
        :src="require('../../assets/img/header-logo-1c-pos.svg')"
        class="mt-3"
        contain
        height="200"
        width="200"
      />
    </div>
  </v-layout>
</template>

<script>
export default {
  auth: false,

  head() {
    return {
      title: "Вход"
    };
  },

  layout: "fullscreen",

  data: () => ({
    form: {
      email: "",
      password: ""
    },
    password_visible: false
  }),

  async mounted() {},

  methods: {
    async submit() {
      this.$auth
        .loginWith("local", {
          data: this.form
        })
        .then(() => {
          this.$router.push({
            name: "index"
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
};
</script>

<style scoped>
h1,
h3 {
  font-weight: 300;
}

h1 {
  color: #636363;
}

h3 {
  color: #4a89dc;
}
</style>
