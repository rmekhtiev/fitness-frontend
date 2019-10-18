export default function(nuxt) {
  const { $axios, redirect, app } = nuxt;
  const { $toast, $auth } = app;

  // eslint-disable-next-line no-unused-vars
  $axios.onRequest(config => {});

  $axios.onError(error => {
    // console.error(error);

    if (error.response && error.response.data && error.response.data.message) {
      $toast.error(error.response.data.message, { duration: 5000 });

      if (
        error.response.status === 401 &&
        error.response.data.message.toLowerCase().includes("token has expired")
      ) {
        $auth.logout().then(() => {
          redirect({
            name: "auth-login"
          });
        });
      }
    } else {
      $toast.error(error.message, { duration: 5000 });
    }
  });
}
