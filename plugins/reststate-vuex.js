import {resourceModule} from '@reststate/vuex';

export default function ({$axios, store}, injext) {
  store.registerModule('activities', resourceModule({name: 'activities', httpClient: $axios}));
  store.registerModule('clients', resourceModule({name: 'clients', httpClient: $axios}));
  store.registerModule('halls', resourceModule({name: 'halls', httpClient: $axios}));
  store.registerModule('employees', resourceModule({name: 'employees', httpClient: $axios}));
  store.registerModule('users', resourceModule({name: 'users', httpClient: $axios}));
  store.registerModule('lockers', resourceModule({name: 'lockers', httpClient: $axios}));
  store.registerModule('locker-claims', resourceModule({name: 'locker-claims', httpClient: $axios}));
  store.registerModule('trainers', resourceModule({name: 'trainers', httpClient: $axios}));
  store.registerModule('issues', resourceModule({name: 'issues', httpClient: $axios}));
}
