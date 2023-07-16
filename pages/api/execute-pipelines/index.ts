
// curl -L \
//   -H "Accept: application/vnd.github+json" \
//   -H "Authorization: Bearer <YOUR-TOKEN>"\
//   -H "X-GitHub-Api-Version: 2022-11-28" \
//   https://api.github.com/user

import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from '../auth/[...nextauth]'
import { getServerSession } from "next-auth/next"


const hasRepository = async (owner, repository, accessToken) => {
    try {
        await axios.get(`https://api.github.com/repos/${owner}/${repository}`, {
            headers: {
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                // @ts-ignore
                'Authorization': `Bearer ${accessToken}`
            }
        })

        return true;
    } catch (error) {
        return false;
    }
}

const createRepository = async (repository, description) => {
    const { data: repositoryData } = await axios.post("https://api.github.com/user/repos", {
        "name": repository,
        "description": description,
        "private": true,
        "is_template": false
    }, {
        headers: {
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            // @ts-ignore
            'Authorization': `Bearer ${session.user.accessToken}`
        }
    })

    console.log(repositoryData)
    console.log("@@@@@@@@@@@@@@@")

    return repositoryData
}

const getFileSha = async (owner, repository, path, accessToken) => {
    try {
        const { data } = await axios.get(`https://api.github.com/repos/${owner}/${repository}/contents/${path}`, {
            headers: {
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                // @ts-ignore
                'Authorization': `Bearer ${accessToken}`
            }
        })

        return data.sha;
    } catch (error) {
        console.log(error)
        return null;
    }
}

const createFile = async (owner, email, repository, content, path, accessToken) => {
    await axios.put(`https://api.github.com/repos/${owner}/${repository}/contents/${path}`, {
        "message": "Send pipeline generated to github repository",
        "committer": { "name": owner, "email": email },
        "content": content
    }, {
        headers: {
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            // @ts-ignore
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

const updateFile = async (owner, email, repository, path, fileSha, content, accessToken) => {
    await axios.put(`https://api.github.com/repos/${owner}/${repository}/contents/${path}`, {
        "message": "Update pipeline generated to github repository",
        "committer": { "name": owner, "email": email },
        "content": content,
        "sha": fileSha
    }, {
        headers: {
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            // @ts-ignore
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    // @ts-ignore
    const session = await getServerSession(req, res, authOptions)

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

    const PATH = '.github/workflows/pipeline.yml'
    const REPOSITORY_NAME = "simulate-github-actions-pipeline";
    const REPOSITORY_DESCRIPTION = "The repository created to run pipeline generated in generator pipeline github actions site"
    const hasCreatedRepository = await hasRepository(
        // @ts-ignore
        data.login, REPOSITORY_NAME, session.user.accessToken
    );

    if (!hasCreatedRepository) {
        await createRepository(REPOSITORY_NAME,REPOSITORY_DESCRIPTION )
    }

    const pipelineContent = req.body.content;

    // @ts-ignore
    const fileSha = await getFileSha(data.login, REPOSITORY_NAME, PATH, session.user.accessToken)
    if (!fileSha) {
        await createFile(
            // @ts-ignore
            data.login, data.email, REPOSITORY_NAME, 
            Buffer.from(pipelineContent, 'utf-8').toString("base64"),
            // @ts-ignore
            PATH, session.user.accessToken
        )
    } else {
        await updateFile(
            data.login, data.email,
            REPOSITORY_NAME, PATH, fileSha,
            Buffer.from(pipelineContent, 'utf-8').toString("base64"),
            // @ts-ignore
            session.user.accessToken
        )
    }

    res.status(200).json({
        linkToAccessGithubAction: `https://github.com/${data.login}/${REPOSITORY_NAME}/actions`
    })
}