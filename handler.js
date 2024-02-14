
const hello = async (event, context) => {

    const hour = new Date().getHours();
    const minutes = new Date().getMinutes();
    const seconds = new Date().getSeconds();

    return {
        "statusCode": 200,
        "body": JSON.stringify({ 'message': `Hola Argentina: ${hour}:${minutes}:${seconds} actual`})
    }
}

module.exports = {
    hello
}