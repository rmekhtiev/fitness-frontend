function safe(obj) {
  return new Proxy(obj, {
    get(target, name) {
      const result = target[name];
      if (result) {
        return result instanceof Object ? safe(result) : result;
      }
      return safe({});
    }
  });
}

const safeMixin = {
  methods: {
    safe
  }
};

export { safeMixin };

export default safe;
