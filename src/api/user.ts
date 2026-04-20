import request from '../utils/request'
// 登录接口
export const userLoginService = ({ username, password }: any) =>
  request.post<any>('/api/login', { username, password })
// 获取用户基本信息
export const userGetInfoService = ({ username }: any) =>
  request.post<any>('/my/userinfo', { username })
//获取所有用户信息
export const allUserGetService = (obj: {
  pagenum: any
  username?: any
  birthday?: any
  nick_name?: any
}) => request.post<any>('/my/getAllUser', obj)
//获取数据展示页数据
export const getDataCountService = () => request.post<any>('/my/getDataCount')
//deepseek接口
// export const chatToDeepseekService = ({ username }: any) =>
//   request.post<any>('/my/userinfo', { username })
