const express = require('express');
const app = express();
const getRawBody = require('raw-body');
const crypto = require('crypto');
const secretKey = process.env.secretKey;

app.post('/webhooks/orders/create', async (req, res) => {
  console.log('🎉 We got an order!')

  // We'll compare the hmac to our own hash
  const hmac = req.get('X-Shopify-Hmac-Sha256')

  // Use raw-body to get the body (buffer)
  const body = await getRawBody(req)
  const newOrder = JSON.parse(body.toString())
  console.log(newOrder)

  try {
    const body = await getRawBody(req)
    const newOrder = JSON.parse(body.toString())
    console.log(newOrder)
  } catch (e) {
    console.log('Something went wrong:')
    console.log(e)
  }

  // Create a hash using the body and our key
  const hash = crypto
    .createHmac('sha256', secretKey)
    .update(body, 'utf8', 'hex')
    .digest('base64')

  // Compare our hash to Shopify's hash
  if (hash === hmac) {
    // It's a match! All good
    console.log('🎉 Phew, it came from Shopify!')
    res.sendStatus(200)
  } else {
    // No match! This request didn't originate from Shopify
    console.log('👻 Danger! Not from Shopify!')
    res.sendStatus(403)
  }
})

//lt --port 3000
app.listen(3000, () => console.log('Webhook listening on port 3000!'))
