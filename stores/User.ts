export const useUser = defineStore("User", {
  state: () => ({
    isLoggedIn: false,
  }),
  getters: {},
  actions: {
    login() {
      this.isLoggedIn = true;
      // useRouter().push('/');
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot));
}
