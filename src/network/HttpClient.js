import axios from 'axios';

const HttpClient = (() => {
    const createInstance = options => {
        const { baseUrl, timeout } = options;
        const axiosInstance = axios.create({
            baseURL: baseUrl,
            timeout,
        });

        axiosInstance.interceptors.request.use(
            async config => {
                console.log('Config', config);
                console.log('Request url', config.url);
                return Promise.resolve(config);
            },
            async error => {
                console.log('Request Error', error);
                return Promise.reject(error);
            },
        );

        axiosInstance.interceptors.response.use(
            async response => {
                console.log('response', response);
                console.log('status', response.status);
                return Promise.resolve(response.data);
            },
            async error => {
                if (error.response) {
                    return Promise.reject(
                        new Error(error.message)
                    );
                }
                if (error.request) {
                    return Promise.reject(
                        new Error(
                            'Service is unavailable',
                        ),
                    );
                }
                return Promise.reject(
                    new Error('Something went wrong!'),
                );
            },
        );

        return axiosInstance;
    };

    return {
        getInstance: (
            options = { baseUrl: 'https://www.googleapis.com', timeout: 30000 },
        ) => {
            return createInstance(options);
        },
        cancelToken: () => {
            return axios.CancelToken;
        },
        isCancel: thrown => {
            return axios.isCancel(thrown);
        },
    };
})();

export default HttpClient;
