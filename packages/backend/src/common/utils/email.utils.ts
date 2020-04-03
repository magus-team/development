import { Injectable } from '@nestjs/common'
import { InjectConfig } from 'nestjs-config'
import * as path from 'path'
import fs from 'fs'
import Mail from 'nodemailer/lib/mailer'
import nodemailer from 'nodemailer'

@Injectable()
export class EmailUtils {
    constructor(@InjectConfig() private readonly config) {
        this.inTestingMode = config.get('email.inTestingMode')
        this.verifyEmailLink = config.get('email.verifyEmailLink')
        this.resetPasswordLink = config.get('email.resetPasswordLink')
        this.noReplySender = config.get('email.noReplySender')

        if (this.inTestingMode) {
            this.mailTransporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: this.config.get('email.testUser'),
                    pass: this.config.get('email.testPassword'),
                },
            })
        } else {
            this.mailTransporter = nodemailer.createTransport(this.smtpConnectionUrl)
        }
    }

    private readonly inTestingMode: boolean
    private readonly smtpConnectionUrl?: string
    private readonly verifyEmailLink: string
    private readonly resetPasswordLink: string
    private readonly noReplySender: string
    private mailTransporter: Mail

    async sendVerifyAccountEmail(email: string, token: string): Promise<void> {
        const verifyURL = `${this.verifyEmailLink}/${token}?email=${email}`
        // read the html content
        let emailTemplate: string = fs.readFileSync(
            path.resolve(__dirname + '../../../../email_templates/html/verify_account.html'),
            {
                encoding: 'utf8',
            },
        )
        emailTemplate = emailTemplate.replace(/{{verifyURL}}/g, verifyURL)

        const mailOptions = {
            from: this.noReplySender,
            to: email,
            subject: 'Welcome, Please Verify Your Email',
            html: emailTemplate,
        }

        const info = await this.mailTransporter.sendMail(mailOptions)

        if (this.inTestingMode) {
            console.log('Verify Email sent: %s', info.messageId)
            // Preview only available when sending through an Ethereal account
            console.log('Verify Email Preview URL: %s', nodemailer.getTestMessageUrl(info))
        }
    }

    async sendResetPasswordLink(email: string, token: string): Promise<void> {
        const resetPasswordLink = `${this.resetPasswordLink}/${token}?email=${email}`

        let emailTemplate: string = fs.readFileSync(
            path.resolve(__dirname + '../../../../email_templates/html/reset_password.html'),
            {
                encoding: 'utf8',
            },
        )
        emailTemplate = emailTemplate.replace(/{{resetPasswordURL}}/g, resetPasswordLink)

        const mailOptions = {
            from: this.noReplySender,
            to: email,
            subject: 'Magus, Reset Your Password',
            html: emailTemplate,
        }

        const info = await this.mailTransporter.sendMail(mailOptions)

        if (this.inTestingMode) {
            console.log('Rest Password Email sent: %s', info.messageId)
            // Preview only available when sending through an Ethereal account
            console.log('Rest Password Email Preview URL: %s', nodemailer.getTestMessageUrl(info))
        }
    }
}
