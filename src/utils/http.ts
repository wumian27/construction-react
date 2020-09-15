import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
} from 'axios';

/** 获取cookie数据 */
export const getCookie = (key: string): string => {
    const regexp = new RegExp(`${key}=([^;]+);?`);
    const result = regexp.exec(window.document.cookie);
    if (!result) {
        return '';
    }
    if (Array.isArray(result) && result[1] !== null) {
        return result[1] || '';
    }
    return '';
};

/**网络请求默认配置 */

let defaultConfig: AxiosRequestConfig = {
    timeout: 20000,
    // withCredentials: true,
    // headers: {
        // 'X-XSRF-TOKEN': getCookie('ec_csrf_token'),
    //     'X-Requested-With': 'XMLHttpRequest',
    // }
}

/**网络错误枚举 */
enum HttpError {
    H404 = '接口未找到',
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

export interface ResponseData<D> {
    code: number;
    msg: string;
    data?: D;
}

/** 按默认配置生成的实例 */
let http = createHttp();

const getHttp = (url: string): AxiosInstance => {
    if (/^https?:\/\//.test(url)) {
        return createHttp({ baseURL: '' })
    }

    return http;
}
interface ReqError {
    type: 'http' | 'server' | 'client';
    code: number;
    defaultMsg: string;
}

/** http错误处理 */
let errorManage = (error: ReqError): void => {
    console.error(error);
};
/** 合并请求数据和URL */
const createQueryUrl = (url: string, params: RequestParams = {}): string => {
    const query = Object.keys(params)
        .reduce((result: string[], key: string): string[] => {
            const str = `${key}=${encodeURIComponent(params[key])}`;
            result.push(str);
            return result;
        }, [])
        .join('&');
    return `${url}?${query}`;
};
/** 处理正常http的业务返回 通用处理server 返回的错误信息 */
function virifyServerCode<D>({ data }: AxiosResponse): ResponseData<D> | null {
    if (data.code === 401) {
        errorManage({ type: 'server', code: 401, defaultMsg: HttpError.H401 })
        return null;
    }

    if(data.code === 402) {
        errorManage({type: 'server', code: 402, defaultMsg: HttpError.H402});
        return null;
    }

    if(data.code === 403) {
        errorManage({type: 'server', code: 403, defaultMsg: HttpError.H403})
        return null;
    }

    if (data.code === 404) {
        errorManage({ type: 'server', code: 404, defaultMsg: HttpError.H404 });
        return null;
    }
    if (data.code !== 200) {
        errorManage({ type: 'server', code: data.code, defaultMsg: data.msg || HttpError.OTHER });
        return null;
    }

    return data;
}

/** 处理不正常的http状态  适用于http错误，本地错误等问题 */
const errorFunc = (error: AxiosError): null => {
    const { status = -1 } = error.isAxiosError && error.response ? error.response : {};

    if (status === -1) {
        errorManage({ type: 'client', code: -1, defaultMsg: HttpError.OTHER });
    } else {
        errorManage({ type: 'http', code: status, defaultMsg: HttpError.OTHER });
    }

    return null;
};

/** 提取正常的返回的业务数据 从server返回数据中提取data，正常返回的无data数据返回空对象 */
function getResponesData<D>(data: ResponseData<D>): D | {} | null {
    if (data === null) {
        return null;
    }
    if (data.data) {
        return data.data;
    }
    return {};
}


/**
 * @description: GET请求，返回业务data
 */
export async function get<D>(
    url: string,
    params: RequestParams = {},
    headers: Headers = {},
): Promise<D | {} | null> {
    try {
        const result = await getHttp(url).get(url, {
            params,
            headers,
        })
        const data = virifyServerCode<D>(result);
        if (data === null) {
            return null
        }

        return getResponesData<D>(data);

    } catch (error) {
        return errorFunc(error)
    }
}

/**
 * @description: GET请求，返回res
 */

export async function normalGet<D>(
    url: string,
    params: RequestParams = {},
    headers: Headers = {},
):Promise<ResponseData<D> | null> {
    try{
        const result = await getHttp(url).get(url, {
            params,
            headers,
        })
        return result.data;
    } catch(error) {
        return errorFunc(error)
    }
}



/**
 * @description:POST请求，返回业务data
 */
export async function post<D>(
    url: string,
    params: RequestParams = {},
    headers: Headers = {},
): Promise<D | {} | null> {
    try {
        const result = await getHttp(url).post(url, params, { headers });
        const data = virifyServerCode<D>(result);
        if (data === null) {
            return null;
        }
        return getResponesData<D>(data);
    } catch (error) {
        return errorFunc(error);
    }
}
/**
 * @description:POST请求，返回res
 */
export async function normalPost<D>(
    url: string,
    params: RequestParams = {},
    headers: Headers = {},
): Promise<ResponseData<D> | null> {
    try {
        const result = await getHttp(url).post(url, params, { headers });
        if (result.data.code === 401) {
            window.location.href = 'https://html.workec.com/v2/wx_crm_lite/autherror';
        }
        return result.data;
    } catch (error) {
        return errorFunc(error);
    }
}

/**
 * @description:DELETE请求，返回业务data
 */
export async function remove<D>(
    url: string,
    params: RequestParams = {},
    headers: Headers = {},
): Promise<D | {} | null> {
    try {
        const result = await getHttp(url).delete(createQueryUrl(url, params), { headers });
        const data = virifyServerCode<D>(result);
        if (data === null) {
            return null;
        }
        return getResponesData<D>(data);
    } catch (error) {
        return errorFunc(error);
    }
}
/**
 * @description:DELETE请求，返回res
 */
export async function normalRemove<D>(
    url: string,
    params: RequestParams = {},
    headers: Headers = {},
): Promise<ResponseData<D> | null> {
    try {
        const result = await getHttp(url).delete(createQueryUrl(url, params), { headers });
        return result.data;
    } catch (error) {
        return errorFunc(error);
    }
}

interface CacheResult<D> {
    time: number;
    data: D;
}
/**
 * @description:为无参数请求生成缓存包装
 * @param  promise:无参数的请求
 * @param  key:在sessionStorage中保存的key
 * @param time:过期时长（秒）
 * @return  :promise返回的数据（缓存的或不是缓存的）
 */
export function createSessionCachePromise<D>(
    promiseCreator: () => Promise<D>,
    key: string,
    time: number,
): (checkResult?: (result: D) => boolean) => Promise<D> {
    return async (checkResult?: (result: D) => boolean): Promise<D> => {
        if (time <= 0) {
            const result = await promiseCreator();
            return result;
        }
        const saveToSessionCache = (result: D): D => {
            if (result === null || (checkResult && checkResult(result) === false)) {
                return result;
            }
            const cache: CacheResult<D> = {
                time: new Date().valueOf(),
                data: result,
            };
            sessionStorage.setItem(key, JSON.stringify(cache));
            return result;
        };
        const resultStr = sessionStorage.getItem(key);
        if (!resultStr) {
            const result = await promiseCreator();
            return saveToSessionCache(result);
        }
        let resultObj: CacheResult<D>;
        try {
            resultObj = JSON.parse(resultStr);
        } catch (e) {
            console.log(e);
            const result = await promiseCreator();
            return saveToSessionCache(result);
        }
        const now = new Date().valueOf();
        if (!resultObj || !resultObj.time || resultObj.time + time * 1000 < now) {
            const result = await promiseCreator();
            return saveToSessionCache(result);
        }
        if (checkResult && checkResult(resultObj.data) === false) {
            const result = await promiseCreator();
            return saveToSessionCache(result);
        }
        return Promise.resolve(resultObj.data);
    };
}
/**
 * @description:为无参数请求生成缓存包装,可以强制更新
 * @param  promise:无参数的请求
 * @param  key:在sessionStorage中保存的key
 * @param time:过期时长（秒）
 * @return  :供直接调用的方法，参数为是否强制刷新
 */
export function createSessionCacheWithRefresh<D>(
    func: () => Promise<D>,
    key: string,
    time: number,
): (refreshCache?: boolean) => Promise<D> {
    const cachePromise = createSessionCachePromise<D>(func, key, time);
    return async (refreshCache?: boolean): Promise<D> => {
        if (refreshCache === true) {
            const result = await func();
            const cache = {
                time: new Date().valueOf(),
                data: result,
            };
            sessionStorage.setItem(key, JSON.stringify(cache));
            return result;
        }
        const result = await cachePromise();
        return result;
    };
}
