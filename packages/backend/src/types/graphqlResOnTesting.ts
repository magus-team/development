type GraphQLErrorException = {
    message: string
    response: {
        error: string
        message: string
        statusCode: number
    }
    status: number
}

type GraphQLErrorExtension = {
    code: string
    exception: GraphQLErrorException
}

type GraphQLError = {
    extensions: GraphQLErrorExtension
    locations: [
        {
            line: number
            column: number
        },
    ]
    message: string
    path: string[]
}

export type GraphqlResultOnCatching<D = {}, V = {}> = {
    request: {
        query: string
        variables: V
    }
    response: {
        data: D
        errors: GraphQLError[]
        status: number
    }
}
