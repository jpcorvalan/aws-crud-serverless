const aws = require("aws-sdk");

// const dynamodbClient = new aws.DynamoDB.DocumentClient();        constante para ejecutar en la nube

// variable que se utilizará dependiendo del condicional de "offline o no"
let dynamoDbClientParams = {}

if (process.env.IS_OFFLINE) {
    require('dotenv').config();

    const accessKeyId = process.env.DEFAULT_ACCESS_KEY;
    const secretKeyId = process.env.DEFAULT_SECRET;
    
    dynamoDbClientParams = {                                      // constante para ejecutar en local
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        accessKeyId: accessKeyId,
        secretAccessKey: secretKeyId
    }
}

const dynamodbClient = new aws.DynamoDB.DocumentClient(dynamoDbClientParams);

const updateUsers = async (event, context) => {

    let userId = event.pathParameters.id;

    const patchUserBody = JSON.parse(event.body);

    var params = {
        TableName: "usersTable",
        Key: {
            pk: userId
        },
        UpdateExpression: "set #name = :n, #cellphone = :c",
        ExpressionAttributeNames: {
            '#name': 'name',
            '#cellphone': 'cellphone'
        },
        ExpressionAttributeValues: {
            ":n": patchUserBody.name,
            ":c": patchUserBody.cellphone
        },
        ReturnValues: 'ALL_NEW'
    };

    return dynamodbClient
        .update(params)
        .promise()
        .then(res => {
            console.log(res)
            return {
                "statusCode": 200,
                "body": JSON.stringify({ 'user': res.Attributes })
            }
        })
}

module.exports = {
    updateUsers
}