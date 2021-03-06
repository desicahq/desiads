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

const sendAd = async (req, res) => {  
    await runMiddleware(req, res, cors)

    const { data: ads, error } = await supabase
        .from('ads')
        .select('title, description, url, id')

    const ad = Math.floor(Math.random() * ads.length)

    if (req.method === 'POST') {
        const id = req.body.id
        const domain = req.body.domain

        const { data: exists, error:existsErr  } = await supabase
            .from('sites')
            .select('*')
            .eq('domain', domain)
            .eq('id', id)

        if (exists) {
            const { data:views, error:viewsErr } = await supabase
                .from('sites')
                .select('views')

            let count = views[0].views + 1
            console.log(typeof count)
            console.log(id)
            console.log(domain)

            const { data: sent, error: sentErr } = await supabase
                .from('sites')
                .update({views: count})
                .eq('domain', domain)

            return res.status(200).json(ads[ad])
        }

        return res.status(404).json('Site ' + domain + ' with an id of ' + id + ' was not found.')
    }
  
    if (error) return res.status(401).json({ error: error.message })
    return res.status(200).json(ads[ad])
  }
  
  export default sendAd