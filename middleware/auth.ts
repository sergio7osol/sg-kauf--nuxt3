const isLoggedIn = useState('isLoggedIn', () => false); 

export default defineNuxtRouteMiddleware((to, from) => {
    // let userIsLoggedIn = false;

    console.log('isLoggedIn MIDdleWARE}: ', isLoggedIn);
    

    if (!isLoggedIn) {
        return navigateTo({path: '/login'});
        // return abortNavigation('You have to be logged in in order to visit this page.');
    }
})
