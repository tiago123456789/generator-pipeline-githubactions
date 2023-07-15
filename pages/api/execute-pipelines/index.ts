
// curl -L \
//   -H "Accept: application/vnd.github+json" \
//   -H "Authorization: Bearer <YOUR-TOKEN>"\
//   -H "X-GitHub-Api-Version: 2022-11-28" \
//   https://api.github.com/user

import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from '../auth/[...nextauth]'
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

    const { data } = await axios.get("https://api.github.com/user", {
        headers: {
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            // @ts-ignore
            'Authorization': `Bearer ${session.user.accessToken}`
        }
    })

    console.log(data)
    console.log("@@@@@@@@@@@@@@@")
    const REPOSITORY_NAME = "simulate-github-actions-pipeline";

    // const { data: repositoryData } = await axios.post("https://api.github.com/user/repos", {
    //     "name": REPOSITORY_NAME,
    //     "description": "The repository created to run pipeline generated in generator pipeline github actions site",
    //     "private": true,
    //     "is_template": false
    // }, {
    //     headers: {
    //         'Accept': 'application/vnd.github+json',
    //         'X-GitHub-Api-Version': '2022-11-28',
    //         // @ts-ignore
    //         'Authorization': `Bearer ${session.user.accessToken}`
    //     }
    // })

    // console.log(repositoryData)
    // console.log("@@@@@@@@@@@@@@@")

    const pipelineTest = `apiVersion: apps/v1
    kind: Deployment
    metadata:
     labels:
       app: nginx
       name: nginx
    spec:
     replicas: 1
     selector:
      matchLabels:
       app: nginx
     template:
      metadata:
       labels:
        app: nginx
      spec:
       containers:
       - image: nginx
         name: nginx`

//          curl -L \
//   -X PUT \
//   -H "Accept: application/vnd.github+json" \
//   -H "Authorization: Bearer <YOUR-TOKEN>"\
//   -H "X-GitHub-Api-Version: 2022-11-28" \
//   https://api.github.com/repos/OWNER/REPO/contents/PATH \
//   -d '{"message":"my commit message","committer":{"name":"Monalisa Octocat",
    // "email":"octocat@github.com"},"content":"bXkgbmV3IGZpbGUgY29udGVudHM="}'
    try {
        const { data: fileData } = await axios.put(`https://api.github.com/repos/${data.login}/${REPOSITORY_NAME}/contents/.github/workflows/pipeline.yml`, {
            "message": "Send pipeline generated to github repository",
            "committer": { "name": data.login, "email": data.email },
            "content": Buffer.from(pipelineTest, "utf-8").toString("base64")
        }, {
            headers: {
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                // @ts-ignore
                'Authorization': `Bearer ${session.user.accessToken}`
            }
        })
        console.log(fileData)

    } catch(error) {
        console.log(error?.reponse)
        console.log(error?.reponse?.data)
        return res.status(500).json({ error: error?.reponse?.data })
    }
    


    res.status(200).json({
        message: "hi function"
    })
}