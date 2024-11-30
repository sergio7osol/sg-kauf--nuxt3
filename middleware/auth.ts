export default defineNuxtRouteMiddleware((to, from) => {
    let userIsLoggedIn = false;

    if (!userIsLoggedIn) {
        return navigateTo({path: '/login'});
        // return abortNavigation('You have to be logged in in order to visit this page.');
    }
})
