export const getWindowHeight = (): number => {
    let height = window.innerHeight;
    if(window.innerHeight) {
        height = window.innerHeight;
    } else if ((document.body) && (document.body.clientHeight)) {
        height = document.body.clientHeight;
    }

    if(
        document.documentElement
        && document.documentElement.clientHeight
        && document.documentElement.clientWidth
         ) {
             height = document.documentElement.clientWidth;
         }
    return height;
}
