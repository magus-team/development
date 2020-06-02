import { ConfigService } from 'nestjs-config'
import { getRepository } from 'typeorm'
import { GraphQLClient } from 'graphql-request'
import { JwtService } from '@nestjs/jwt'
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify'
import { Test } from '@nestjs/testing'
import * as bcrypt from 'bcryptjs'

import { GraphqlResultOnCatching } from 'types/graphqlResOnTesting'
import {
    Client,
    IsAvailable,
    MutationStatus,
    RegisterInput,
    ResetPasswordInput,
    RoleType,
    TrustedUserApp,
    User,
    UsernameInput,
    UserRole,
    UserToken,
} from '@magus/types'

import { AppModule } from 'modules/app.module'
import { AuthResolver } from 'modules/auth/auth.resolver'
import { ClientResolver } from 'modules/client/client.resolver'
import { ClientService } from 'modules/client/client.service'
import { createDBIfNotExist } from 'common/utils/pg.utils'
import { EmailUtils } from 'common/utils/email.utils'
import { getJwtModuleOptionByConfig } from 'modules/jwt.module'
import { TESTING_SERVER_PORT } from 'common/constants'
import { TrustedUserAppService } from 'modules/auth/trustedUserApp.service'
import { UserResolver } from './user.resolver'
import { UserRoleService } from './userRole.service'
import { UserService } from './user.service'

describe('User Resolver (e2e)', () => {
    let adminEmailAddress: string
    let app: NestFastifyApplication
    let config: ConfigService
    let defaultClientId: string
    let graphqlEndpoint: string
    let registerInput: RegisterInput
    let resetPasswordToken: string
    let systemKey: string
    let userService: UserService

    beforeAll(async () => {
        await createDBIfNotExist('magus-test-user')

        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule.register('magus-test-user')],
        }).compile()

        app = moduleFixture.createNestApplication(new FastifyAdapter())
        config = app.get(ConfigService)
        config.set('pg.database', 'magus-test-user')
        systemKey = config.get('management.systemKey')
        adminEmailAddress = config.get('management.adminEmailAddress')
        defaultClientId = config.get('pwa.PWAClientId')

        await app.init()
        await app.listen(TESTING_SERVER_PORT.USER)

        graphqlEndpoint = `${await app.getUrl()}/graphql`

        // create default client
        const clientResolver = new ClientResolver(new ClientService(getRepository(Client)))
        await clientResolver.initialPWAClient(defaultClientId)

        userService = new UserService(getRepository(User))

        registerInput = {
            email: 'ahmad@gmail.com',
            password: 'Ahmad@123456',
        }
    })

    afterAll(async () => {
        await app.close()
    })

    describe('availableUsername > Query', () => {
        const availableUsernameQuery = `
            query AvailableUsername($data: UsernameInput!){
                availableUsername(data: $data){
                    available
                    message
                }
            }
        `

        let loggedInUserToken: string
        let user: User
        let secondUser: User

        beforeAll(async () => {
            const authResolver = new AuthResolver(
                userService,
                new TrustedUserAppService(getRepository(TrustedUserApp)),
                new JwtService(getJwtModuleOptionByConfig(config)),
                config,
            )
            const userResolver = new UserResolver(
                userService,
                new UserRoleService(getRepository(UserRole)),
                new EmailUtils(config),
            )
            await userResolver.register(registerInput)
            // verify the user
            user = await userService.findByEmail(registerInput.email)
            user.isVerified = true
            await userService.save(user)

            const clientService = new ClientService(getRepository(Client))
            const currentClient = await clientService.validateClient(defaultClientId)
            const loginResult = await authResolver.login(currentClient, {
                email: registerInput.email,
                password: registerInput.password,
            })
            loggedInUserToken = (loginResult[0] as UserToken).jwt

            const secondUserRegisterInput = {
                email: 'arash@gmail.com',
                password: '@rash12345',
            }
            await userResolver.register(secondUserRegisterInput)
            secondUser = await userService.findByEmail(secondUserRegisterInput.email)
        })

        it(`should get 403(forbidden resource) error since don't have authorization header`, async () => {
            const gClient = new GraphQLClient(graphqlEndpoint)
            await gClient
                .request<{ availableUsername: IsAvailable }>(availableUsernameQuery, {
                    data: { username: 'ahmad' } as UsernameInput,
                })
                .catch((result: GraphqlResultOnCatching) => {
                    expect(result.response.errors[0].message).toBe('Forbidden resource')
                    expect(result.response.errors[0].extensions.exception.status).toBe(403)
                })
        })

        it('should be available his/her username', async () => {
            const gClient = new GraphQLClient(graphqlEndpoint, {
                headers: {
                    authorization: `Bearer ${loggedInUserToken}`,
                },
            })
            const {
                availableUsername: { available, message },
            } = await gClient.request<{ availableUsername: IsAvailable }>(availableUsernameQuery, {
                data: { username: user.username } as UsernameInput,
            })
            expect(available).toBe(true)
            expect(message).toBe('The username is available.')
        })

        it('should not be available the second username', async () => {
            const gClient = new GraphQLClient(graphqlEndpoint, {
                headers: {
                    authorization: `Bearer ${loggedInUserToken}`,
                },
            })
            const {
                availableUsername: { available, message },
            } = await gClient.request<{ availableUsername: IsAvailable }>(availableUsernameQuery, {
                data: { username: secondUser.username } as UsernameInput,
            })
            expect(available).toBe(false)
            expect(message).toBe('This username is not available, please choose another one.')
        })

        afterAll(async () => {
            // delete the user information
            await userService.delete(user.id)
            await userService.delete(secondUser.id)
        })
    })

    describe('initAdminUser > Mutation', () => {
        const initAdminUserMutation = `
            mutation {
            initAdminUser{
                isSucceeded
                message
            }}`

        it(`should get 403(forbidden resource) error since don't have system-key header`, async () => {
            const gClient = new GraphQLClient(graphqlEndpoint)
            await await gClient
                .request<{ initAdminUser: MutationStatus }>(initAdminUserMutation)
                .catch((result: GraphqlResultOnCatching) => {
                    expect(result.response.errors[0].message).toBe('Forbidden resource')
                    expect(result.response.errors[0].extensions.exception.status).toBe(403)
                })
        })

        it('should initial the admin user based on the management.adminEmailAddress config', async () => {
            const gClient = new GraphQLClient(graphqlEndpoint, {
                headers: {
                    'system-key': systemKey,
                },
            })
            const {
                initAdminUser: { isSucceeded, message },
            } = await gClient.request<{ initAdminUser: MutationStatus }>(initAdminUserMutation)
            expect(isSucceeded).toBe(true)
            expect(message).toBe('The administrator account has been created')
            const u = await userService.findByEmail(adminEmailAddress, ['roles'])
            expect(u).toBeDefined()
            expect(u.roles.filter((r) => r.role === RoleType.ADMINISTRATOR).length).toBe(1)
        })

        it('should get false when the admin user has already been created', async () => {
            const gClient = new GraphQLClient(graphqlEndpoint, {
                headers: {
                    'system-key': systemKey,
                },
            })
            const {
                initAdminUser: { isSucceeded, message },
            } = await gClient.request<{ initAdminUser: MutationStatus }>(initAdminUserMutation)
            expect(isSucceeded).toBe(false)
            expect(message).toBe('The system already has an administrator account')
        })
    })

    describe('register > Mutation', () => {
        const registerMutation = `
        mutation Register($data: RegisterInput!){
            register(data: $data){
                message
                isSucceeded
            }
        }
    `

        it(`Should get 403(forbidden resource) error since don't have client-id header`, async () => {
            const gClient = new GraphQLClient(graphqlEndpoint)
            await gClient
                .request(registerMutation, { data: registerInput })
                .catch((result: GraphqlResultOnCatching) => {
                    expect(result.response.errors[0].message).toBe('Forbidden resource')
                    expect(result.response.errors[0].extensions.exception.status).toBe(403)
                })
        })

        it('should register successfully', async () => {
            const gClient = new GraphQLClient(graphqlEndpoint, {
                headers: {
                    'client-id': defaultClientId,
                },
            })
            const {
                register: { isSucceeded, message },
            } = await gClient.request<{ register: MutationStatus }>(registerMutation, { data: registerInput })
            expect(isSucceeded).toBe(true)
            expect(message).toBe('you successfully registered, please check your email to verify your account.')
            const newUser = await getRepository(User).findOne({ email: registerInput.email })
            expect(newUser.isVerified).toBe(false)
            expect(newUser.username).toBe(registerInput.email.split('@')[0])
            expect(newUser.actionTokens.verifyEmail).toBeDefined()
        })

        it('should get bad request error on registering with the same email', async () => {
            const gClient = new GraphQLClient(graphqlEndpoint, {
                headers: {
                    'client-id': defaultClientId,
                },
            })
            await gClient
                .request<{ register: MutationStatus }>(registerMutation, { data: registerInput })
                .catch((result: GraphqlResultOnCatching) => {
                    expect(result.response.errors[0].message).toBe(
                        'already have a user with this email, please login with this email.',
                    )
                    expect(result.response.errors[0].extensions.exception.status).toBe(400)
                })
        })
    })

    describe('forgotPassword > Mutation', () => {
        const forgotPasswordMutations = `
        mutation ForgotPassword($email: String!){
            forgotPassword(email: $email){
                isSucceeded
                message
            }
        }
    `
        it(`should get 403(forbidden resource) error since don't have client-id header`, async () => {
            const gClient = new GraphQLClient(graphqlEndpoint)
            await gClient
                .request(forgotPasswordMutations, { email: registerInput.email })
                .catch((result: GraphqlResultOnCatching) => {
                    expect(result.response.errors[0].message).toBe('Forbidden resource')
                    expect(result.response.errors[0].extensions.exception.status).toBe(403)
                })
        })

        it('should get false with random email', async () => {
            const gClient = new GraphQLClient(graphqlEndpoint, {
                headers: {
                    'client-id': defaultClientId,
                },
            })
            const {
                forgotPassword: { isSucceeded, message },
            } = await gClient.request<{ forgotPassword: MutationStatus }>(forgotPasswordMutations, {
                email: 'random@random.com',
            })
            expect(isSucceeded).toBe(false)
            expect(message).toBe('there is no account with this email address')
        })

        it('should send the forgot password link by email', async () => {
            const gClient = new GraphQLClient(graphqlEndpoint, {
                headers: {
                    'client-id': defaultClientId,
                },
            })
            const {
                forgotPassword: { isSucceeded, message },
            } = await gClient.request<{ forgotPassword: MutationStatus }>(forgotPasswordMutations, {
                email: registerInput.email,
            })
            expect(isSucceeded).toBe(true)
            expect(message).toBe('the reset password link email has been send, please check your email.')

            const u = await userService.findByEmail(registerInput.email)
            resetPasswordToken = u.actionTokens.resetPassword.token
            expect(u.actionTokens.resetPassword).toBeDefined()
            expect(new Date(u.actionTokens.resetPassword.validUntil).getTime()).toBeGreaterThan(
                Date.now() + 1000 * 60 * 60 * 4.8,
            ) // the actual is 5 hours
        })
    })

    describe('resetPassword > Mutation', () => {
        const resetPasswordMutation = `
            mutation ResetPassword($data: ResetPasswordInput!){
                resetPassword(data: $data){
                    isSucceeded
                    message
                }
            }
        `
        it(`should get 403(forbidden resource) error since don't have client-id header`, async () => {
            const gClient = new GraphQLClient(graphqlEndpoint)
            await gClient
                .request(resetPasswordMutation, {
                    data: {
                        email: registerInput.email,
                        token: resetPasswordToken,
                        password: '@Ahmad1234',
                    } as ResetPasswordInput,
                })
                .catch((result: GraphqlResultOnCatching) => {
                    expect(result.response.errors[0].message).toBe('Forbidden resource')
                    expect(result.response.errors[0].extensions.exception.status).toBe(403)
                })
        })

        it('should get bad request error with invalid reset password token', async () => {
            const gClient = new GraphQLClient(graphqlEndpoint, {
                headers: {
                    'client-id': defaultClientId,
                },
            })
            await gClient
                .request<{ resetPassword: MutationStatus }>(resetPasswordMutation, {
                    data: {
                        email: registerInput.email,
                        token: 'invalid_token',
                        password: '@Ahmad1234',
                    } as ResetPasswordInput,
                })
                .catch((result: GraphqlResultOnCatching) => {
                    expect(result.response.errors[0].message).toBe('the token is invalid')
                })
        })

        it('should get bad request error when token is expired', async () => {
            // we can't wait until token expiration, we fake it
            const u = await userService.findByEmail(registerInput.email)
            u.actionTokens.resetPassword.validUntil = new Date(Date.now() - 1000 * 10)
            await userService.save(u)
            const gClient = new GraphQLClient(graphqlEndpoint, {
                headers: {
                    'client-id': defaultClientId,
                },
            })
            await gClient
                .request<{ resetPassword: MutationStatus }>(resetPasswordMutation, {
                    data: {
                        email: registerInput.email,
                        token: resetPasswordToken,
                        password: '@Ahmad1234',
                    } as ResetPasswordInput,
                })
                .catch((result: GraphqlResultOnCatching) => {
                    expect(result.response.errors[0].message).toBe('the token is invalid')
                })

            // rollback faking action
            u.actionTokens.resetPassword.validUntil = new Date(new Date().getTime() + 1000 * 60 * 60 * 5) // 5 hours
            await userService.save(u)
        })

        it('should rest password successfully', async () => {
            const gClient = new GraphQLClient(graphqlEndpoint, {
                headers: {
                    'client-id': defaultClientId,
                },
            })
            const password = 'NEW@Ahmad1234'
            const {
                resetPassword: { message, isSucceeded },
            } = await gClient.request<{ resetPassword: MutationStatus }>(resetPasswordMutation, {
                data: { email: registerInput.email, token: resetPasswordToken, password } as ResetPasswordInput,
            })
            expect(isSucceeded).toBe(true)
            expect(message).toBe('the new password has been set successfully.')

            const u = await userService.findByEmail(registerInput.email)

            expect(u.actionTokens.resetPassword).toBeUndefined()

            expect(await bcrypt.compare(password, u.password)).toBe(true)
        })
    })

    describe('resendVerifyEmail > Mutation', () => {
        const resendVerifyEmailMutation = `
        mutation ResendVerifyEmail($email: String!){
            resendVerifyEmail(email: $email){
                isSucceeded
                message
            }
        }
    `

        it(`should get 403(forbidden resource) error since don't have client-id header`, async () => {
            const gClient = new GraphQLClient(graphqlEndpoint)
            await gClient
                .request(resendVerifyEmailMutation, { email: registerInput.email })
                .catch((result: GraphqlResultOnCatching) => {
                    expect(result.response.errors[0].message).toBe('Forbidden resource')
                    expect(result.response.errors[0].extensions.exception.status).toBe(403)
                })
        })

        it('should get 400(Not found) error with unknown email', async () => {
            const gClient = new GraphQLClient(graphqlEndpoint, {
                headers: {
                    'client-id': defaultClientId,
                },
            })
            await gClient
                .request(resendVerifyEmailMutation, { email: 'random@random.com' })
                .catch((result: GraphqlResultOnCatching) => {
                    expect(result.response.errors[0].message).toBe(
                        'There is no account with this email that is not verified yet!',
                    )
                    expect(result.response.errors[0].extensions.exception.status).toBe(404)
                })
        })

        it('should resend verify email when the user is unverified', async () => {
            const gClient = new GraphQLClient(graphqlEndpoint, {
                headers: {
                    'client-id': defaultClientId,
                },
            })
            const {
                resendVerifyEmail: { isSucceeded, message },
            } = await gClient.request<{ resendVerifyEmail: MutationStatus }>(resendVerifyEmailMutation, {
                email: registerInput.email,
            })
            expect(isSucceeded).toBe(true)
            expect(message).toBe('The verification email has been send, Please check your email.')
            const u = await userService.findByEmail(registerInput.email)
            expect(u.actionTokens.verifyEmail).toBeDefined()
            expect(new Date(u.actionTokens.verifyEmail.validUntil).getTime()).toBeGreaterThan(
                Date.now() + 1000 * 60 * 60 * 23.8,
            ) // the actual is 24
        })

        it('should get 400(Not found) error with verified account', async () => {
            const gClient = new GraphQLClient(graphqlEndpoint, {
                headers: {
                    'client-id': defaultClientId,
                },
            })
            await gClient
                .request(resendVerifyEmailMutation, { email: registerInput.email })
                .catch((result: GraphqlResultOnCatching) => {
                    expect(result.response.errors[0].message).toBe(
                        'There is no account with this email that is not verified yet!',
                    )
                    expect(result.response.errors[0].extensions.exception.status).toBe(404)
                })
        })
    })
})
