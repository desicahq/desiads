import { supabase } from '@/utils/supabase-client'
import { stripe } from '@/utils/stripe'
import Cors from 'cors'

// Initializing the cors middleware
const cors = Cors({
    methods: ['GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}

const click = async (req, res) => {
    await runMiddleware(req, res, cors)

    const { slug } = req.query

    let { data: ad, adErr } = await supabase
        .from('ads')
        .select('*')
        .eq('id', slug[0])

    let { data: site, siteErr } = await supabase
        .from('sites')
        .select('*')
        .eq('id', slug[1])

    console.log(ad, slug)

    if (!slug[0]) return res.status(404).end(`No campaign slug was provided`)
    if (!slug[1]) return res.status(403).end(`You'll need to specify your site id`)
    if (!ad[0]) return res.status(404).end(`Desiad campaign not found`)
    if (!site[0]) return res.status(404).end(`Your desiad site id: ${slug[1]} is invalid or missing`)

    let adClickCount = ad[0].clicks + 1
    let siteClickCount = site[0].clicks + 1
    console.log(adClickCount)

    let { data: updateAdClicks, updateAdErr } = await supabase
        .from('ads')
        .update({ clicks: adClickCount })
        .eq('id', slug[0])

    let { data: subId, error: subIdErr } = await supabase
    .from('subscriptions')
    .select('id')

    let stringSubId = subId.toString()

    console.log(subId.toString())

        stripe.subscriptionItems.createUsageRecord(
            stringSubId,
            {
              quantity: 1
            }
         );

    let { data: updateSiteClicks, updateSiteErr } = await supabase
        .from('sites')
        .update({ clicks: siteClickCount })
        .eq('id', slug[1])

    console.log(slug[0])

    return res.end('Hi') //res.redirect(ad[0].url)

}

export default click