import CryptoJS from 'crypto-js';

export class Crypto<T extends object> {
  /** Secret */
  secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }
  /** AES encrypt (对称加密) */
  encrypt(data: T): string {
    const dataString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(dataString, this.secret);
    return encrypted.toString();
  }
  /** AES decrypt (对称解密) */
  decrypt(encrypted: string) {
    const decrypted = CryptoJS.AES.decrypt(encrypted, this.secret);
    const dataString = decrypted.toString(CryptoJS.enc.Utf8);
    try {
      return JSON.parse(dataString) as T;
    } catch {
      // avoid parse error
      return null;
    }
  }
}
/**
 * MD5 哈希工具类
 */
export class MD5 {
  /**
   * 计算字符串的 MD5 哈希值
   * @param data 输入字符串
   * @returns 32位小写十六进制哈希值
   */
  static encrypt(data: string): string {
    return CryptoJS.MD5(data).toString();
  }
}
