import { supabase } from '@/utils/supabase-client'
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

    if (!slug[0]) return res.status(404).end(`Desiad campaign not found`)
    if (!slug[1]) return res.status(403).end(`You'll need to specify your domain id`)

    let adClickCount = ad[0].clicks + 1
    let siteClickCount = site[0].clicks + 1
    console.log(adClickCount)

    let { data: updateAdClicks, updateAdErr } = await supabase
        .from('ads')
        .update({clicks: adClickCount})
        .eq('id', slug[0])

    let { data: updateSiteClicks, updateSiteErr } = await supabase
        .from('sites')
        .update({clicks: siteClickCount})
        .eq('id', slug[1])

    console.log(slug[0])

    return res.redirect(ad[0].url)

  }
  
  export default click