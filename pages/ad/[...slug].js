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

    return ad

}

export default click