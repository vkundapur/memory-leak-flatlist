import HttpClient from '../network/HttpClient';

const axios = HttpClient.getInstance();

export const searchBooks = async (
    searchTerm,
    startIndex = 0,
    maxResults = 10,
    cancelToken = null,
) => {
    try {
        const response = await axios({
            cancelToken,
            method: 'get',
            url: `/books/v1/volumes?q=${searchTerm}&startIndex=${startIndex}&maxResults=${maxResults}&printType=books`,
        });
        console.log('response', response);
        const { totalItems, kind: resultKind, items } = response;
        console.log('items', items);
        let results;
        if (totalItems > 0) {
            const books = items.map(item => {
                const { volumeInfo, id, kind } = item;
                return {
                    id,
                    kind,
                    ...volumeInfo,
                };
            });
            results = {
                kind: resultKind,
                totalItems,
                items: books,
            };
            console.log('Total search results', totalItems);
            console.log('results', results);
        } else {
            results = {
                kind: resultKind,
                totalItems,
                items: [],
            };
        }
        return Promise.resolve(results);
    } catch (err) {
        console.log('err', err);
        return Promise.reject(err);
    }
};
