import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
} from 'axios';


/**网络请求默认配置 */

let defaultConfig: AxiosRequestConfig = {
    timeout: 20000,
    withCredentials: true,
    // headers: {
    //     'X-Requested-With': 'XMLHttpRequest',
    // }
}

/**网络错误枚举 */
enum HttpError {
    H404= '接口未找到',
    H403 = '没有权限访问',
    H402 = '服务异常',
    H401 = '鉴权失败',
    OTHER = '服务器错误',
}

/**
 * GET请求，返回业务data
 */
interface RequestParams {
    [key: string]: any;
}

interface Headers {
    [key: string]: string;
}

/** 创建网络请求工具 */
function createHttp(config: AxiosRequestConfig = {}): AxiosInstance {
    const instanse = axios.create({
        ...defaultConfig,
        ...config,
    });
    return instanse;
}

const getHttp = (url:string): AxiosInstance => {
    if(/^https?:\/\//.test(url)) {
        return createHttp({ baseURL: ''})
    }
}
 export async function get<D>(
     url: string,
     params: RequestParams = {},
     headers: Headers = {},
 ):Promise<D | {} | null> {
     try {
         const result = await getHttp(url).get(url, {
             params,
             headers,
         })

     } catch(e) {
         return ;
     }
 }
