const baseUrl = 'https://api.themoviedb.org/3/';
const apiKey = '82840c8525c00bc9c19bf7cdb3c928a8';

const toQueryString = (obj) => {
    return (
        _.map(obj, (v, k) => {
            if (_.isArray(v)) {
                return (_.map(v, (av) => `${k}[]=${av}`)).join('&');
            } else {
                return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
            }
        })
    ).join('&');
};
const toUrl = (url = '', params = {}) => {
    let q = toQueryString(params);
    let urlBuffer = [url];
    if (q) {
        urlBuffer.push(/\?.+$/.test(url) ? `&${q}` : `?${q}`);
    }
    return urlBuffer.join('');
};
const buildUrl = (url, params) => toUrl(`${baseUrl}${url}?api_key=${apiKey}`, params);

const apiUrls = {
	get popularMovies() { return buildUrl('movie/popular'); },
	get popularTvShows() { return buildUrl('tv/popular'); },
	get discoverMovies() {  return buildUrl('discover/movie', {page: 2}); },
	get discoverTvShows() {  return buildUrl('discover/tv', {page: 2}); },
	movieDetails(id) { return buildUrl(`movie/${id}`); }
}

export default apiUrls;