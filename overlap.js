import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const dynamodb = new DynamoDBClient({ region: "us-east-2" });

export const handler = async (event) => {
  try {
    // Retrieve the rangeId from the query parameters
    const rangeId = event.queryStringParameters.rangeId;

    // Retrieve the salary range for User 1 from DynamoDB
    const user1Range = await retrieveSalaryRange(rangeId, "1");

    // Retrieve the salary range for User 2 from DynamoDB
    const user2Range = await retrieveSalaryRange(rangeId, "2");

    const isValid = user1Range && user2Range;

    // Determine if there is an overlap between the ranges
    const isOverlap = isValid && checkRangeOverlap(user1Range, user2Range);

    // Prepare the response
    const response = {
      statusCode: 200,
      body: JSON.stringify({ isOverlap: isOverlap, isValid: isValid })
    };

    return response;
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to check range overlap. Please try again.' })
    };
  }
};

// Helper function to retrieve the salary range from DynamoDB
async function retrieveSalaryRange(rangeId, stage) {

  const command = new GetItemCommand({
    TableName: 'salaryoverlap',
    Key: { rangeid: { S: rangeId }, stage: { N: stage } }
  });

  const { Item } = await dynamodb.send(command);
  //console.log("ITEM");
  //console.log(Item);

  return Item;
}

// Helper function to check if there is an overlap between two ranges
function checkRangeOverlap(range1, range2) {
  // Implement your own logic to determine if there is an overlap
  // between range1 and range2. For example, you can compare the
  // minimum and maximum values of the ranges.
  console.log("1 min")
  console.log(range1.salaryMin.N);
  console.log("2 min")
  console.log(range2.salaryMin.N);
  console.log("1 max")
  console.log(range1.salaryMax.N);
  console.log("2 max")
  console.log(range2.salaryMax.N);

  return checkOverlap(
    parseInt(range1.salaryMin.N), parseInt(range1.salaryMax.N), 
    parseInt(range2.salaryMin.N), parseInt(range2.salaryMax.N)
  );

}


function checkOverlap(x, y, a, b) {
  // Check if x is between a and b or y is between a and b
  if ((x >= a && x <= b) || (y >= a && y <= b)) {
    return true; // Overlap exists
  }

  return false; // No overlap
}
