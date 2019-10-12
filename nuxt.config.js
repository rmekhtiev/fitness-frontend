import colors from 'vuetify/es5/util/colors'
import ru from 'vuetify/es5/locale/ru'

export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - MULTIPOWER',
    title: process.env.npm_package_name || '',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: process.env.npm_package_description || ''}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700|Material+Icons'
      }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {color: '#fff'},
  /*
  ** Global CSS
  */
  css: [
    '@/assets/css/v-data-iterator.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/reststate-vuex',
    '@/plugins/vuelidate',
    '@/plugins/vue-the-mask',
    '@/plugins/vue-i18n',
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/toast',
    '@nuxtjs/moment'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',

    ['nuxt-rfg-icon', {
      staticPath: '/_favicons/',
      masterPicture: 'assets/img/header-logo-1c-pos.svg'
    }],
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    host: 'fitness.test',
    prefix: '/api/',
    port: '80',

    proxy: true,
  },

  proxy: {
    '/api/': 'http://fitness.test/'
  },

  router: {
    middleware: ['auth']
  },

  auth: {
    redirect: {
      login: '/auth/login',
      logout: '/',
      callback: '/auth/login',
      home: '/'
    },

    strategies: {
      local: {
        endpoints: {
          login: {url: '/auth/jwt/login', method: 'post', propertyName: 'data.jwt'},
          logout: {url: '/auth/jwt/token', method: 'delete'},
          user: {url: '/auth/me', method: 'get', propertyName: 'data'}
        },
      },
      watchLoggedIn: true,
      rewriteRedirects: true
    },

    plugins: [
      {src: '~/plugins/axios'},
    ]
  },

  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    },
    lang: {
      locales: {ru},
      current: 'ru',
    },
  },

  toast: {
    duration: 3000,
  },

  moment: {
    defaultLocale: 'ru',
    locales: ['ru']
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
