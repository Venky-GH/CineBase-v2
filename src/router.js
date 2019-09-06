import Vue from 'vue'
import Router from 'vue-router'
import MovieListing from './components/movies/MovieListing.vue'
import Form from './components/form/Form.vue'

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'movies',
            component: MovieListing
        },
        {
            path: '/add',
            name: 'addMovie',
            component: Form
            // component: () => import('./views/About.vue')
        },
        {
            path: '/edit/:id',
            name: 'editMovie',
            component: Form
        }
    ]
})
