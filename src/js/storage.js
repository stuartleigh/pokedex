export default class LocalStorage {
  get(key) {
    return window.localStorage.getItem(key);
  }
  set(key, val) {
    return window.localStorage.setItem(key, val);
  }
}