module.exports = {
    server_port: 3000,
    db_url: 'mongodb://localhost:27017/frontenddb',
    db_schemas: [{file:'./member_schema', collection:'member2', schemaName:'MemberSchema', 
    modelName:'MemberModel'}],  // 스키마 따로 만들기 
    facebook: {
        clientID: '729134371404447',
        clientSecret: 'f3cd3b99404e4007a12e5826ea992975',
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    }
}