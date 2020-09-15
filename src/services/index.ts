import { API } from '../definitions'
import { Result } from 'antd'
import { normalGet } from '../utils/http';
import { MockData } from '../definitions/chatSide'
type Result<D> = Promise<D | {} | null>;
export const getMock = (params = {}): Result<MockData> => (
    normalGet<MockData>(API.mockUrl)
)
