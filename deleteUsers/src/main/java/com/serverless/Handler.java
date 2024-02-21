package com.serverless;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DeleteItemOutcome;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.PrimaryKey;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import org.apache.http.HttpStatus;

public class Handler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

	AmazonDynamoDB dynamoClient = AmazonDynamoDBClientBuilder.standard().build();
	DynamoDB dynamoDB = new DynamoDB(dynamoClient);
	String tableName = "usersTable";

	@Override
	public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent apiGatewayProxyRequestEvent, Context context) {
		Table table = dynamoDB.getTable(tableName);

		String uuidPk = apiGatewayProxyRequestEvent.getPathParameters().get("id");
		PrimaryKey primaryKey = new PrimaryKey("pk", uuidPk);

		try {
			DeleteItemOutcome outcome = table.deleteItem(primaryKey);

			return new APIGatewayProxyResponseEvent().withStatusCode(HttpStatus.SC_OK).withBody("User " + uuidPk + " has been deleted");
		} catch (Exception e) {
			return new APIGatewayProxyResponseEvent().withStatusCode(HttpStatus.SC_INTERNAL_SERVER_ERROR);
		}
	}

}
