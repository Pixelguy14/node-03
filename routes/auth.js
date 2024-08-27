import jwt from 'jsonwebtoken'
const top_secret = 'qwerty098765432' //avoid sharing this key

export function generateToken(payload){
    return jwt.sign(payload, top_secret, {expiresIn: '1h'})
}

export function verifyToken(token) {
    return jwt.verify(token, top_secret)
}