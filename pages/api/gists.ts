import { randomUUID } from "crypto"
import axios from "axios"
import { getSession } from "next-auth/react"
import { NextApiRequest, NextApiResponse } from "next";


export default async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getSession({ req })
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
  }).catch(console.log)

  console.log(session)
  // @ts-ignore
  console.log(response.data)
  res.end()
}