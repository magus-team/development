export default {
    inTestingMode: process.env.EMAIL_TESTING_MODE === 'true' || process.env.NODE_ENV === 'development',
    testUser: process.env.EMAIL_TESTING_USER,
    testPassword: process.env.EMAIL_TESTING_PASSWORD,
    smtpConnectionUrl: process.env.EMAIL_SMTP_CONNECTION_URL,
    verifyEmailLink: process.env.EMAIL_VERIFY_EMAIL_LINK || 'http://localhost:3000/user/verify',
    noReplySender: process.env.EMAIL_NO_REPLY_SENDER || '"No Reply" <no-reply@magux.ir>',
}
