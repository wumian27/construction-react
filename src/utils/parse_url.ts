export const parseUrl = (): object => {
    const url: string = decodeURIComponent(window.location.search);
    const theRequest = {};
    if(url.indexOf('?') !== -1) {
        const str: string = url.substr(1);
        const strs = str.split('&');
        for(let i = 0; i < strs.length; i += 1) {
            theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
        }
    }

    return theRequest;
}
