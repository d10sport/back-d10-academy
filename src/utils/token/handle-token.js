import jwt from 'jsonwebtoken'
import { variablesJWT } from '../params/const.jwt.js'

export async function generateToken(payload, time = null) {
    let secretOrPrivateKey = variablesJWT.jwt_secret
    let options = { algorithm: variablesJWT.algorithm };
    if (time) {
        options.expiresIn = time;
    }
    return jwt.sign(payload, secretOrPrivateKey, options)
}

export async function verifyToken(token) {
    let secretOrPrivateKey = variablesJWT.jwt_secret
    return jwt.verify(token, secretOrPrivateKey)
}