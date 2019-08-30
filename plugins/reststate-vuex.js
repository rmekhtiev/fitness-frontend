import {resourceModule} from '@reststate/vuex';

export default function ({$axios, store}, injext) {
  store.registerModule('clients', resourceModule({name: 'clients', httpClient: $axios}));
}
