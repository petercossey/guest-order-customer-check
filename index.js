import Fastify from 'fastify'
import Handlebars from 'handlebars'
import PointOfView from '@fastify/view'
import fetch from 'node-fetch'
import getOrder from './lib/getOrder.js'
import getCustomer from './lib/getCustomer.js'
import updateOrder from './lib/updateOrder.js'

// const bc_store_hash = process.env['store_hash']
// const bc_access_token = process.env['access_token']

const fastify = Fastify({ logger: true })

fastify.register(PointOfView, {
  engine: {
    handlebars: Handlebars
  }
})

fastify.get('/', async (req, reply) => {
  return reply.view('/pages/index.hbs')
})

fastify.post('/webhooks', async (req, reply) => {
  const newOrder = req.body
  console.log(newOrder)
  if (newOrder.data.type === 'order') {
    // get order using newOrder.data.id
    const orderId = newOrder.data.id
    const orderData = await getOrder(orderId)
    // console.log(orderData)
    if (orderData.customer_id === 0) {
      // search for customer using billind address email
      const email = orderData.billing_address.email
      const customerSearch = await getCustomer(email)
      if (customerSearch.data.length > 0) {
        // update order with customer id
        const customerId = customerSearch.data[0].id;
        const orderBody = {
          customer_id: customerId
        }
        const changeOrder = await updateOrder(orderId, orderBody)
        console.log(changeOrder)
      }
    }
  }
})

const start = async () => {
  try {
    await fastify.listen({ port: 80, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()