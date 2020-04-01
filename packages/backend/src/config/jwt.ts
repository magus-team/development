export default {
    publicKey: process.env.JWT_RSA_PUBLIC_KEY.replace(/\\n/g, '\n'),
    privateKey: process.env.JWT_RSA_PRIVATE_KEY.replace(/\\n/g, '\n'),
    tokenExpiresInMin: Number(process.env.TOKEN_EXPIRE_IN_MIN || 90),
    refreshTokenExpireInMin: Number(process.env.REFRESH_TOKEN_EXPIRE_IN_MIN || 60 * 24 * 30), // default is 30 days
}
