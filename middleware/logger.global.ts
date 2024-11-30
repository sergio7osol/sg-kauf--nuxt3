export default defineNuxtRouteMiddleware((to, from) => {
    console.log('Middleware from: ', from);
    console.log('Middleware to: ', to);
})
