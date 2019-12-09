import ru from "vuetify/es5/locale/ru";

export default {
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "%s - " + process.env.npm_package_name,
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700|Material+Icons"
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: ["@/assets/css/v-data-iterator.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "@/plugins/reststate-vuex",
    "@/plugins/vuelidate",
    "@/plugins/vue-the-mask",
    "@/plugins/vue-i18n",
    "@/plugins/vuetify-datetime-picker"
  ],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    "@nuxtjs/vuetify",
    "@nuxtjs/toast",
    "@nuxtjs/moment",
    "@nuxtjs/dotenv"
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "@nuxtjs/auth",
    "@nuxtjs/sentry"
  ],

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    host: "fitness.test",
    prefix: "/api/",
    port: "80",

    proxy: true
  },

  proxy: {
    "/api/": "http://104.248.47.70:8000/"
  },

  router: {
    middleware: ["auth"]
  },

  auth: {
    redirect: {
      login: "/auth/login",
      logout: "/",
      callback: "/auth/login",
      home: "/"
    },

    strategies: {
      local: {
        endpoints: {
          login: {
            url: "/auth/jwt/login",
            method: "post",
            propertyName: "data.jwt"
          },
          logout: { url: "/auth/jwt/token", method: "delete" },
          user: { url: "/auth/me", method: "get", propertyName: "data" }
        }
      },
      watchLoggedIn: true,
      rewriteRedirects: true
    },

    plugins: [{ src: "~/plugins/axios" }]
  },

  sentry: {},

  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    lang: {
      locales: { ru },
      current: "ru"
    }
  },

  toast: {
    duration: 3000
  },

  moment: {
    defaultLocale: "ru",
    locales: ["ru"]
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    // eslint-disable-next-line no-unused-vars
    extend(config, ctx) {
      // if (ctx.isDev && ctx.isClient) {
      //   config.module.rules.push({
      //     enforce: "pre",
      //     test: /\.(js|vue)$/,
      //     loader: "eslint-loader",
      //     exclude: /(node_modules)/
      //   })
      // }
    }
  }
};
