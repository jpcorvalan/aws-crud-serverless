const aws = require("aws-sdk");
require('dotenv').config();

const accessKeyId = process.env.DEFAULT_ACCESS_KEY;
const secretKeyId = process.env.DEFAULT_SECRET;

// const dynamodbClient = new aws.DynamoDB.DocumentClient();        constante para ejecutar en la nube

// variable que se utilizará dependiendo del condicional de "offline o no"
let dynamoDbClientParams = {}

if (process.env.IS_OFFLINE) {
    dynamoDbClientParams = {                                      // constante para ejecutar en local
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        accessKeyId: accessKeyId,
        secretAccessKey: secretKeyId
    }
}

const dynamodbClient = new aws.DynamoDB.DocumentClient(dynamoDbClientParams);

const getUsers = async (event, context) => {

    let userId = event.pathParameters.id;

    var params = {
        ExpressionAttributeValues: { ':pk': userId },
        KeyConditionExpression: "pk = :pk",
        TableName: "usersTable",
    };

    return dynamodbClient
        .query(params)
        .promise()
        .then(res => {
            console.log(res)
            let foundUser = res.Items;
            return {
                "statusCode": 200,
                "body": JSON.stringify({ 'user': foundUser })
            }
        })
}

module.exports = {
    getUsers
}