import {resourceModule} from '@reststate/vuex';

export default function ({$axios, store}, injext) {
  store.registerModule('clients', resourceModule({name: 'clients', httpClient: $axios}));
  store.registerModule('halls', resourceModule({name: 'halls', httpClient: $axios}));
  store.registerModule('employees', resourceModule({name: 'employees', httpClient: $axios}));
}
