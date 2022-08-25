import fetch from 'node-fetch'

const bc_store_hash = process.env['store_hash']
const bc_access_token = process.env['access_token']

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'X-Auth-Token': bc_access_token
}

async function getOrder(orderId) {
  const url = `https://api.bigcommerce.com/stores/${bc_store_hash}/v2/orders/${orderId}`
  console.log(url)
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });
    const json = await response.json();
    return json
  } catch (err) {
    console.log(err)
  }
}

export default getOrder