import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {promisify} from 'util';
const Jwt = require('jsonwebtoken')
const signAsync = promisify(Jwt.sign);


export class JwtService {
  @inject('authentication.Jwt.secret')
  public readonly JwtSecret: string;
  @inject('authentication.Jwt.expiresIn')
  public readonly JwtexpiresIn: string;
  async generateToken(userProfile: UserProfile): Promise<String> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized("while generating token : User Profile is Null");
    }


    let token = "";
    try {
      token = await signAsync(userProfile, "Modiii146@", {
        expiresIn: "10h"

      })
    }
    catch (error) {
      throw new HttpErrors.Unauthorized(`error generating Token ${error}`)
    }
    return token;
  }
}
