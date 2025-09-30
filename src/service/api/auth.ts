import { request, xcomRequest } from '../request';

/**
 * Login
 *
 * @param userName User name
 * @param password Password
 */
export function fetchLogin(userName: string, password: string) {
  return xcomRequest<Api.Auth.LoginToken>({
    url: '/infra/system/account/login',
    method: 'post',
    data: {
      userName,
      password
    }
  });
}

/** Get user info */
export function fetchGetUserInfo() {
  return xcomRequest<Api.Auth.UserInfo>({ url: '/infra/system/account/getUserInfo' });
}

/** 修改用户基本信息 */
export function fetchUpdateProfile(data: Api.Auth.UserProfileModifyParams) {
  return xcomRequest<boolean>({
    url: '/infra/system/account/modify/profile',
    method: 'post',
    data
  });
}

/** 修改用户密码 */
export function fetchUpdatePassword(data: Api.Auth.UserPasswordModifyParams) {
  return xcomRequest<boolean>({
    url: '/infra/system/account/modify/password',
    method: 'post',
    data
  });
}

/** Get logout */
export function fetchLogout() {
  return xcomRequest<boolean>({ url: '/infra/system/account/logout' });
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/refreshToken',
    method: 'post',
    data: {
      refreshToken
    }
  });
}

/**
 * return custom backend error
 *
 * @param code error code
 * @param msg error message
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return request({ url: '/auth/error', params: { code, msg } });
}
