// import { getSession  } from "next-auth/react"
// import { randomUUID } from "crypto"
// import axios from "axios"

// export default async (req, res) => {
//     console.log(req)
//     const session: { [key: string]: any } = await getSession({ req })
//     console.log(session)

//     // const response = await axios.post("https://api.github.com/gists", {
//     //     "public": false,
//     //     "files": {
//     //         [`${randomUUID()}.yaml`]: {
//     //             "content": req.body.content
//     //         }
//     //     }
//     // }, {
//     //     headers: {
//     //         "Accept": "application/vnd.github+json",
//     //         "Authorization": `Bearer ${session.user.accessToken}`,
//     //         "X-GitHub-Api-Version": "2022-11-28"
//     //     }
//     // }).catch(console.log)

//     res.end()
// }

// This is an example of how to read a JSON Web Token from an API route
import { getSession } from "next-auth/client"
import { NextApiRequest, NextApiResponse } from "next";


export default async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getSession({req})
  console.log(session)
  res.end()
}