export default function ({$axios, app}) {
  let {$toast} = app;

  $axios.onRequest(config => {

  });

  $axios.onError(error => {
    console.error(error);

    if (error.response && error.response.data && error.response.data.message ) {
      $toast.error(error.response.data.message, {duration: 5000});
    } else {
      $toast.error(error.message, {duration: 5000});
    }
  })
}
