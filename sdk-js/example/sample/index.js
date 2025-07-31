const {Opal} = require('@getopal/sdk')

const client = new Opal({
  apiKey: 'sk_prod_1f4d700ca8614ad3b84f2d3c2330bdb3',
  orgSlug: 'argos-1'
})

client.authenticate('nikhil.nixel@gmail.com', 'Opal@2025').then(async (resp) => {
  console.log(resp)
  console.log(await client.user())
})
