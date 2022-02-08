export const getCoverUri = book => {
    let cover;
    if (book.imageLinks) {
        cover = book.imageLinks;
    } else {
        cover = null;
    }

    if (cover && cover.thumbnail) {
        return cover.thumbnail
            .replace(/http:\/\//, 'https://')
            .replace(/&edge=curl/, '');
    }
    return null;
};
