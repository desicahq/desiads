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

const getUser = async (req, res) => {  
    await runMiddleware(req, res, cors)

    const { data: ads, error } = await supabase
        .from('ads')
        .select('title, description, url')

    const ad = Math.floor(Math.random() * ads.length)
  
    if (error) return res.status(401).json({ error: error.message })
    return res.status(200).json(ads[ad])
  }
  
  export default getUser