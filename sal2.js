import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const dynamodb = new DynamoDBClient({ region: "us-east-2" });

export const handler = async (event) => {
  try {
    // Retrieve the rangeId and salary range from the request body
    const { rangeId, salaryMin, salaryMax } = JSON.parse(event.body);

    // Store the salary range and job description in DynamoDB
    await dynamodb.send(new PutItemCommand({
      TableName: 'salaryoverlap',
      Item: {
        rangeid: { S: rangeId },
        stage: { N: "2" },
        salaryMin: { N: salaryMin.toString() },
        salaryMax: { N: salaryMax.toString() }
      }
    }));

    // resultLink
    const resultLink = generateResultLink(rangeId);

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ resultLink: resultLink })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to submit salary range. Please try again.' })
    };
  }
};

// Helper function to generate the link for results
function generateResultLink(rangeId) {
  // Implement your own logic to generate the link for User 2,
  // using the rangeId parameter and the appropriate URL format
  return `http://salaryoverlap.s3-website.us-east-2.amazonaws.com/result.html?rangeId=${rangeId}`;
}
