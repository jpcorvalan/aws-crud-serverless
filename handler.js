const aws = require("aws-sdk");
const dynamodbClient = new aws.DynamoDB.DocumentClient();

const getUsers = async (event, context) => {

    var params = {
        ExpressionAttributeValues: { ':pk': '1' },
        KeyConditionExpression: "pk = :pk",
        TableName: "crud-serverless-users",
    };

    return dynamodbClient.query(params).promise().then(res => {
        console.log(res)
        return {
            "statusCode": 200,
            "body": JSON.stringify({ 'user': `${res}` })
        }
    })

    // return {
    //     "statusCode": 200,
    //     "body": JSON.stringify({ 'message': `Hola Argentina: ${hour}:${minutes}:${seconds} actual` })
    // }
}

module.exports = {
    getUsers
}