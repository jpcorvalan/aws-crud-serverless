const aws = require("aws-sdk");
require('dotenv').config();

const accessKeyId = process.env.DEFAULT_ACCESS_KEY;
const secretKeyId = process.env.DEFAULT_SECRET;

// const dynamodbClient = new aws.DynamoDB.DocumentClient();        constante para ejecutar en la nube

const dynamodbClient = new aws.DynamoDB.DocumentClient({         // constante para ejecutar en local
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: accessKeyId,  
    secretAccessKey: secretKeyId
})

const getUsers = async (event, context) => {

    var params = {
        ExpressionAttributeValues: { ':pk': '1' },
        KeyConditionExpression: "pk = :pk",
        TableName: "usersTable",
    };

    return dynamodbClient.query(params).promise().then(res => {
        console.log(res)
        return {
            "statusCode": 200,
            "body": JSON.stringify({ 'user': res })
        }
    })
}

module.exports = {
    getUsers
}