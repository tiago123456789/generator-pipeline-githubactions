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
import { getToken } from "next-auth/jwt"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


export default async (req, res) => {
  // If you don't have NEXTAUTH_SECRET set, you will have to pass your secret as `secret` to `getToken`
  const token = await getToken({ req })
  if (token) {
    // Signed in
    console.log("JSON Web Token", JSON.stringify(token, null, 2))
  } else {
    // Not Signed in
    res.status(401)
  }
  res.end()
}