import axios from 'axios'

export class MyApiService {

    static FetchAllMovies() {
        return axios({
            url: '/api/movies',
            method: 'get'
        });
    }

    static FetchSpecificMovie(movieId) {
        return axios({
            url: '/api/movies/' + movieId,
            method: 'get'
        });
    }

    static FetchAllActors() {
        return axios({
            url: '/api/actors',
            method: 'get'
        });
    }

    static FetchSpecificActor(actorId) {
        return axios({
            url: '/api/actors/' + actorId,
            method: 'get'
        });
    }

    static FetchAllProducers() {
        return axios({
            url: '/api/producers',
            method: 'get'
        });
    }

    static FetchSpecificProducer(producerId) {
        return axios({
            url: '/api/producers/' + producerId,
            method: 'get'
        });
    }

    static AddMovie(movieData) {
        return axios({
            url: '/api/movies',
            method: 'post',
            data: movieData
        })
    }

    static UpdateMovie(movieData, id) {
        return axios({
            url: '/api/movies/' + id,
            method: 'put',
            data: movieData
        })
    }

    static UploadImage(formData) {
        return axios({
            url: '/api/files',
            method: 'post',
            data: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        })
    }

    // Add actor/producer
    static AddItem(details, type) {
        let url = '/api/';
        if (type === 1)
            url += 'actors';
        else
            url += 'producers';
        return axios({
            url: url,
            method: 'post',
            data: details,
            config: {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        });
    }
}