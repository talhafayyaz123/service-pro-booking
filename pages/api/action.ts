import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

const captcha = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return { error: 'method not allowed' }
  }
  try {
    const { token } = req.body
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.NEXT_PUBLIC_CAPTCHA_KEY}
&response=${token}`
    )
    res.status(200).send(response.data)
  } catch (err: any) {
    //eslint-disable-next-line
    console.log('api/action.ts file err:', err)
    res.status(400).send({ err: err.toString() })
  }
}

export default captcha
