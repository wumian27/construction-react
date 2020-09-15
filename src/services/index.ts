import { API } from '../definitions'
import { Result } from 'antd'
import { normalGet } from '../utils/http';

type Result<D> = Promise<D | {} | null>;
export const getMock = (params = {}): Result<any> => (
    normalGet<any>(API.mockUrl)
)
