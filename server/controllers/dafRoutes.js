const crypto = require('crypto');

async function createDaf(req, res) {
    const newFundName = req.body.name;
        const newFundDescription = req.body.description;
        const newFundAdvisorFirstName = req.body['fundAdvisor.firstName'];
        const newFundAdvisorLastName = req.body['fundAdvisor.lastName'];
        const newFundAdvisorEmail = req.body['fundAdvisor.email'];
        const newFundAdvisorAddressLine1 = req.body['fundAdvisor.address.line1'];
        const newFundAdvisorAddressLine2 = req.body['fundAdvisor.address.line2'];
        const newFundAdvisorCity = req.body['fundAdvisor.address.city'];
        const newFundAdvisorState = req.body['fundAdvisor.address.state'];
        const newFundAdvisorZip = req.body['fundAdvisor.address.zip'];
 
    const token = req.headers['authorization']?.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({ message: 'Authorization token is missing' });
        return;
    }

    // Send a request to your backend service to create a DAF
    const fundCreationResponse = await fetch('https://api.dev.endaoment.org/v1/funds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        fundInput: {
          name: newFundName,
          description: newFundDescription,
          advisor: {
            firstName: newFundAdvisorFirstName,
            lastName: newFundAdvisorLastName,
            email: newFundAdvisorEmail,
            address: {
              line1: newFundAdvisorAddressLine1,
              line2: newFundAdvisorAddressLine2 || '', // Optional field
              city: newFundAdvisorCity,
              state: newFundAdvisorState,
              zip: newFundAdvisorZip,
            },
          },
        },
      }),
    });
  
    // We can now return the response to the frontend, it contains the full details of the new DAF
    res.status(200);
    res.json(await fundCreationResponse.json());
    res.end();
}

// This is the part that should be called by your `get-dafs` route handler
async function getDafs(req, res) {
    // Get the Endaoment access token for the user
    // This is a placeholder function, you should replace it with your own implementation
    const token = req.headers['authorization']?.replace('Bearer ', '');
    // Make a request to the Endaoment API to get the list of DAFs
    const usersDafList = await fetch('https://api.dev.endaoment.org/v1/funds/mine', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Pass the user's token in the Authorization header
        Authorization: `Bearer ${token}`,
      },
    });
  
    // We can now return the response to the frontend
    res.status(200);
    res.json(await usersDafList.json());
    res.end();
}

// This is the part that should be called by your `get-wire-instructions` route handler
async function getWireInstructions(req, res) {
    // Make a request to the Endaoment API to get the wire instructions
    const wireInstructions = await fetch(
      // For domestic wire instructions
      'https://api.dev.endaoment.org/v1/donation-pledges/wire/details/domestic',
      // For international wire instructions
      // 'https://api.endaoment.com/v1/donation-pledges/wire/details/international',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          //   This does not need any authentication since this is public information
        },
      }
    );
  
    // We can now return  response to the frontend
    res.status(200);
    res.json(await wireInstructions.json());
    res.end();
}

async function wireDonation(req, res) {
  const amount = req.body['amount'];
  const receivingFundId = req.body['fundId'];
  if (!amount || !receivingFundId) {
    // Return an error response if any of the required fields are missing
    res.status(400);
    res.end();
    return;
  }

  // Get the Endaoment access token for the user
  // This is a placeholder function, you should replace it with your own implementation
  const token = req.headers['authorization']?.replace('Bearer ', '');
  // Generate a unique key for the donation request
  // This can be generated by anything that is unique to the donation request
  const idempotencyKey = crypto.randomUUID();

  // Convert the amount to microdollars
  // 1 dollar = 1,000,000 microdollars
  // The actual formula for the conversion will depend on how you handle currency and data types in your application
  const pledgedAmountMicroDollars = (BigInt(amount) * 1000000n).toString();

  // Make a request to the Endaoment API to create the donation request
  const donationRequest = await fetch(
    'https://api.dev.endaoment.org/v1/donation-pledges/wire',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Pass the user's token in the Authorization header
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        pledgedAmountMicroDollars,
        receivingFundId,
        idempotencyKey,
      }),
    }
  );

  // We can now return the response to the frontend
  res.status(200);
  res.json(await donationRequest.json());
  res.end();
}

async function grant(req, res) {
  const amount = req.body['amount'];
  const originFundId = req.body['fundId'];
  const destinationOrgId = req.body['orgId'];
  const purpose = req.body['purpose'];

  if (!amount || !originFundId || !destinationOrgId || !purpose) {
    // Return an error response if any of the required fields are missing
    res.status(400);
    res.end();
    return;
  }

  // Get the Endaoment access token for the user
  // This is a placeholder function, you should replace it with your own implementation
  const token = req.headers['authorization']?.replace('Bearer ', '');

  // Generate a unique key for the donation request
  // This can be generated by anything that is unique to the donation request
  const idempotencyKey = crypto.randomUUID();

  // Convert the amount to microdollars
  // 1 dollar = 1,000,000 microdollars
  // The actual formula for the conversion will depend on how you handle currency and data types in your application
  const requestedAmount = (BigInt(amount) * 1000000n).toString();

  // Make a request to the Endaoment API to create the donation request
  const grantRequest = await fetch(
    'https://api.dev.endaoment.org/v1/transfers/async-grants',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        originFundId,
        destinationOrgId,
        requestedAmount,
        purpose,
        idempotencyKey,
      }),
    }
  );

  // We can now return the response to the frontend
  res.status(200);
  res.json(await grantRequest.json());
  res.end();
}

module.exports = { createDaf, getDafs , getWireInstructions, wireDonation, grant };