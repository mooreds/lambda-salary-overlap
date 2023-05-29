import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const dynamodb = new DynamoDBClient({ region: "us-east-2" });


export const handler = async (event) => {
  try {
    // Retrieve the salary range and job description from the request body
    const { salaryMin, salaryMax } = JSON.parse(event.body);

    // Generate a unique identifier for the salary range
    const rangeId = generateUniqueRangeId();

    // Store the salary range and job description in DynamoDB
    await dynamodb.send(new PutItemCommand({
      TableName: 'salaryoverlap',
      Item: {
        rangeid: { S: rangeId },
        stage: { N: "1" },
        salaryMin: { N: salaryMin.toString() },
        salaryMax: { N: salaryMax.toString() }
      }
    }));

    // Generate the link for User 2 to enter their salary range
    const user2Link = generateUser2Link(rangeId);

    // resultLink
    const resultLink = generateResultLink(rangeId);

    // Return the link in the Lambda response
    return {
      statusCode: 200,
      body: JSON.stringify({ user2Link: user2Link, resultLink: resultLink })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to submit salary range. Please try again.' })
    };
  }
};

// Helper function to generate a unique identifier for the salary range
function generateUniqueRangeId() {
  // Implement your own logic to generate a unique range ID,
  // such as using a UUID library or a timestamp-based approach
  // Example: return uuidv4();
  return generateUUID();
}

// Helper function to generate the link for User 2
function generateUser2Link(rangeId) {
  // Implement your own logic to generate the link for User 2,
  // using the rangeId parameter and the appropriate URL format
  // Example: return `https://yourdomain.com/user2-entry?rangeId=${rangeId}`;
  return `http://salaryoverlap.s3-website.us-east-2.amazonaws.com/page2.html?rangeId=${rangeId}`;
}

// Helper function to generate the link for results
function generateResultLink(rangeId) {
  // Implement your own logic to generate the link for User 2,
  // using the rangeId parameter and the appropriate URL format
  return `http://salaryoverlap.s3-website.us-east-2.amazonaws.com/result.html?rangeId=${rangeId}`;
}

function generateUUID() {
  let uuid = '';
  const characters = 'abcdef0123456789';
  const segments = [8, 4, 4, 4, 12];

  for (let i = 0; i < segments.length; i++) {
    for (let j = 0; j < segments[i]; j++) {
      uuid += characters[Math.floor(Math.random() * characters.length)];
    }

    if (i < segments.length - 1) {
      uuid += '-';
    }
  }

  return uuid;
}

