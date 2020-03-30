export default () => ({
    port: parseInt(process.env.PORT, 10) || 5000,
    debug: process.env.NODE_ENV === 'development',
    enableGraphqlPlayground: process.env.ENABLE_GRAPHQL_PLAYGROUND === 'true',
    graphqlEndpoint: process.env.GRAPHQL_URL || 'http://localhost:5000/graphql',
})
