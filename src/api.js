import axios from 'axios'

export class myApiService {
    static listItems(type, movie_id = -1) {
        let params = {
            type: type
        };
        if(movie_id !== -1) {
            params.movie_id = movie_id;
        }
        return axios({
            url: '/list_items',
            method: 'get',
            params: params
        })
    }

    static getItemDetails(type, id) {
        return axios({
            url: '/get_actor_producer',
            method: 'get',
            params: {
                fetch_type: type,
                reqID: id
            }
        })
    }

    static addMovie(formData) {
        return axios({
            url: '/add_movie',
            method: 'post',
            data: formData,
            withCredentials: true
        })
    }

    static updateMovie(formData) {
        return axios({
            url: '/update_movie',
            method: 'post',
            data: formData,
            withCredentials: true
        })
    }

    static uploadImage(formData) {
        return axios({
            url: '/upload',
            method: 'post',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        })
    }

    static addItem(formData) {
        return axios({
            url: '/add_actor_producer',
            method: 'post',
            data: formData
        });
    }
}