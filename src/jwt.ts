/**
 * Base class for common JWT implementation.
 */
export class BaseJWT {

  public token: string;
  public exp: Date;

  constructor(token: string) {
    this.token = token;
    let decodedToken = BaseJWT.decodeToken(token);
    this.exp = BaseJWT.dateFromTimestamp(decodedToken.exp);

  }

  /**
   * We want to use date objects and not strings. So the JWT should have a proper date object as expiration time. Using this fuction we can
   * convert Epoch seconds to Date.
   * @param {number} timestamp
   * @returns {Date}
   */
  public static dateFromTimestamp(timestamp: number): Date {
    let date = new Date(0); // The 0 here is the key, which sets the date to the epoch
    date.setUTCSeconds(timestamp);
    return date;
  }

  /**
   * Decoding of JWT
   * @param {string} str
   * @returns {string}
   */
  public static urlBase64Decode(str: string): string {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: { break; }
      case 2: { output += '=='; break; }
      case 3: { output += '='; break; }
      default: {
        throw 'Illegal base64url string!';
      }
    }
    return BaseJWT.b64DecodeUnicode(output);
  }

  // credits for decoder goes to https://github.com/atk
  /**
   * Decoding of JWT
   * @param {string} str
   * @returns {string}
   */
  private static b64decode(str: string): string {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output: string = '';

    str = String(str).replace(/=+$/, '');

    if (str.length % 4 == 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }

    for (
      // initialize result and counters
      let bc: number = 0, bs: any, buffer: any, idx: number = 0;
      // get next character
      buffer = str.charAt(idx++);
      // character found in table? initialize bit storage and add its ascii value;
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf(buffer);
    }

    return output;
  }

  // https://developer.mozilla.org/en/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
  /**
   * Decoding of JWT
   * @param str
   * @returns {string}
   */


  private static b64DecodeUnicode(str: any) {
    //TODO: is this really needed??
    /*
    return decodeURIComponent(
        Array.prototype.map.call(JWT.b64decode(str), (c: any) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
     */

    return str
  }

  /**
   * Will return the decoded data of the JWT in JSON.
   * @returns {JSON}
   */
  public decode(): JSON {
    return BaseJWT.decodeToken(this.token)
  }

  /**
   * Returns true if JWT has expired. Also possible to add an offset so there is time to update the token.
   * @param {number} offsetSeconds
   * @returns {boolean}
   */
  public isExpired(offsetSeconds?: number): boolean {
    return BaseJWT.isTokenExpired(this.token, offsetSeconds)
  }

  /**
   * Returns true if the token is still valid
   * @returns {boolean}
   */
  public isValid(offsetSeconds?: number): boolean {
    return !this.isExpired(offsetSeconds)
  }

  /**
   * Decode a JWT as JSON for an encoded JWT
   * @param {string} token
   * @returns {any}
   */
  public static decodeToken(token: string): any {
    let parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error('JWT must have 3 parts');
    }

    let decoded = BaseJWT.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode the token');
    }

    return JSON.parse(decoded);
  }

  /**
   * Return the expiration date for an encoded JWT
   * @param {string} token
   * @returns {Date}
   */
  public static getTokenExpirationDate(token: string): Date {
    let decoded: any;
    decoded = BaseJWT.decodeToken(token);

    if (!decoded.hasOwnProperty('exp')) {
        let null_date = new Date(0);
      return null_date;
    }

    let date = new Date(0); // The 0 here is the key, which sets the date to the epoch
    date.setUTCSeconds(decoded.exp);

    return date;
  }

  /**
   * Returns true if an encoded JWT is expired.
   * @param {string} token
   * @param {number} offsetSeconds
   * @returns {boolean}
   */
  public static isTokenExpired(token: string, offsetSeconds?: number): boolean {
    let date = BaseJWT.getTokenExpirationDate(token);
    offsetSeconds = offsetSeconds || 0;

    if (date == null) {
      return false;
    }

    // Token expired?
    return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
  }
}

/**
 * Django Rest Framework JWT implementation class.
 */
export class JWT extends BaseJWT {

  public user_id: string;
  public username: string;
  public email: string;
  public orig_iat: Date;

  constructor(token: string) {
    super(token);
    let decodedToken = JWT.decodeToken(token);
    this.user_id = decodedToken.user_id;
    this.username = decodedToken.username;
    this.email = decodedToken.email;
    this.orig_iat = JWT.dateFromTimestamp(decodedToken.orig_iat)
  }

}
