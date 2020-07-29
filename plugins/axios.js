export default function(nuxt) {
  const { $axios, redirect, app } = nuxt;
  const { $toast, $auth } = app;

  // eslint-disable-next-line no-unused-vars
  $axios.onRequest(config => {});

  $axios.onError((error) => {
    if (error.response
        && error.response.data
        && error.response.data.message
        && error.response.status === 401
        && error.response.data.message.toLowerCase().includes("token has expired")) {
      $auth.logout().then(() => {
        redirect({
          name: "auth-login"
        });
      });
    }

    switch (error.response.status) {
      case 403:
        $toast.error('Forbidden')
        break
      case 422:
        $toast.error('Проверьте введенные данные')
        break
      case 500:
        $toast.error('Ошибка сервера')
    }
  })
}
