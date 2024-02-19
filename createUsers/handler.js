require('dotenv').config();

const aws = require("aws-sdk");
const { randomUUID } = require("crypto");

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

const createUsers = async (event, context) => {

    const RANDOM_UUID = randomUUID();

    let userBody = JSON.parse(event.body);

    userBody.pk = RANDOM_UUID;

    var params = {
        TableName: "usersTable",
        Item: userBody
    };

    // Estos logs pueden verse a través de CloudWatch
    console.log(params.Item);

    return dynamodbClient
        .put(params)
        .promise()
        .then(res => {
            console.log(res)
            return {
                "statusCode": 200,
                "body": JSON.stringify({ 'user': params.Item })
            }
        })
}

module.exports = {
    createUsers
}