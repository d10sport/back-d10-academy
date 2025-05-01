export const variablesJWT = ({
  jwt_secret: process.env.JWT_SECRET,
  expiresIn: process.env.EXPIRES_IN,
  algorithm: process.env.JWT_ALGORITHM
})