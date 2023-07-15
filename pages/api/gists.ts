import { randomUUID } from "crypto"
import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next";

import { authOptions } from './auth/[...nextauth]'
import { getServerSession } from "next-auth/next"


export default async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // @ts-ignore
  const session = await getServerSession(req, res, authOptions)
  console.log(session)

  if (!session) {
    res.status(401).json({ message: "User unauthorizated" })
  }

  const response = await axios.post("https://api.github.com/gists", {
    "public": false,
    "files": {
      [`${randomUUID()}.yaml`]: {
        "content": req.body.content
      }
    }
  }, {
    headers: {
      "Accept": "application/vnd.github+json",
      // @ts-ignore
      "Authorization": `Bearer ${session.user.accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  })

  // @ts-ignore
  const { url } = response.data;
  res.json({
    link: url
  })
}