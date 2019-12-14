import { resourceModule } from "@reststate/vuex";

export default function({ $axios, store }) {
  store.registerModule(
    "activities",
    resourceModule({ name: "activities", httpClient: $axios })
  );
  store.registerModule(
    "clients",
    resourceModule({ name: "clients", httpClient: $axios })
  );
  store.registerModule(
    "halls",
    resourceModule({ name: "halls", httpClient: $axios })
  );
  store.registerModule(
    "employees",
    resourceModule({ name: "employees", httpClient: $axios })
  );
  store.registerModule(
    "users",
    resourceModule({ name: "users", httpClient: $axios })
  );
  store.registerModule(
    "roles",
    resourceModule({ name: "roles", httpClient: $axios })
  );
  store.registerModule(
    "lockers",
    resourceModule({ name: "lockers", httpClient: $axios })
  );
  store.registerModule(
    "locker-claims",
    resourceModule({ name: "locker-claims", httpClient: $axios })
  );
  store.registerModule(
    "trainers",
    resourceModule({ name: "trainers", httpClient: $axios })
  );
  store.registerModule(
    "schedules",
    resourceModule({ name: "schedules", httpClient: $axios })
  );
  store.registerModule(
    "groups",
    resourceModule({ name: "groups", httpClient: $axios })
  );
  store.registerModule(
    "issues",
    resourceModule({ name: "issues", httpClient: $axios })
  );
  store.registerModule(
    "subscriptions",
    resourceModule({ name: "subscriptions", httpClient: $axios })
  );
  store.registerModule(
    "bar-items",
    resourceModule({ name: "bar-items", httpClient: $axios })
  );
  store.registerModule(
    "issue-discussions",
    resourceModule({ name: "issue-discussions", httpClient: $axios })
  );
  store.registerModule(
    "visit-history-records",
    resourceModule({ name: "visit-history-records", httpClient: $axios })
  );
  store.registerModule(
    "payments",
    resourceModule({ name: "payments", httpClient: $axios })
  );
  store.registerModule(
      "identifiers",
      resourceModule({ name: "identifiers", httpClient: $axios })
  );
  store.registerModule(
    "training-sessions",
    resourceModule({ name: "training-sessions", httpClient: $axios })
  );
  store.registerModule(
      "requests",
      resourceModule({ name: "requests", httpClient: $axios })
  );
}
