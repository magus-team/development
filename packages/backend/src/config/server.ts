export default {
    graphqlEndpoint: process.env.GRAPHQL_URL || 'http://localhost:5000/graphql',
    port: Number(process.env.PORT || 5000),
}
