import { request, xcomRequest } from '../request';

/**
 * Login
 *
 * @param userName User name
 * @param password Password
 */
export function fetchLogin(userName: string, password: string) {
  return xcomRequest<Api.Auth.LoginToken>({
    url: '/system/account/login',
    method: 'post',
    data: {
      userName,
      password
    }
  });
}

/** Get login info */
export function fetchGetLoginInfo() {
  return request<Api.Auth.UserInfo>({ url: '/system/account/getLoginInfo' });
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
