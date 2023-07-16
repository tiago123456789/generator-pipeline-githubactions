import React, { useEffect, useState } from "react"
import { usePipeline } from "../contexts/PipelineContext";
import {
    Icon,
    Button
} from 'semantic-ui-react'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-yaml';
import 'prismjs/themes/prism.css';
import axios from "axios";
import { useSession } from "next-auth/react";

function PipelineResult() {
    const { data: session } = useSession()
    const { yamlPipeline, setYamlPipeline } = usePipeline()
    const [copied, setCopied] = useState(false)
    const [gistLink, setGistLink] = useState(null);

    async function runPipeline() {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/execute-pipelines`, {
            content: `${yamlPipeline}`,
        }, {
            headers: {
                // @ts-ignore
                Authorization: `Bearer ${session?.user?.accessToken}`
            }
        })

        const aElement = document.createElement('a');
        aElement.href = response.data.linkToAccessGithubAction;
        aElement.click();
    }

    async function saveAsGist() {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/gists`, {
            content: `${yamlPipeline}`,
        }, {
            headers: {
                // @ts-ignore
                Authorization: `Bearer ${session?.user?.accessToken}`
            }
        })

        setGistLink(response.data.link)
    }

    useEffect(() => {
        if (gistLink) {
            setTimeout(() => setGistLink(null), 15000)
        }
    }, [gistLink])

    useEffect(() => {
        if (copied) [
            setTimeout(() => {
                setCopied(false)
            }, 3000)
        ]
    }, [copied])

    return (
        <>
            {gistLink &&
                <Button color="yellow" icon fluid style={{ marginBottom: "5px" }}>
                    <a href={gistLink} target="_blank" style={{ color: "white" }}>
                        Access Gist
                    </a>
                </Button>
            }

            {session &&
                <Button icon fluid style={{ marginBottom: "5px" }}
                    onClick={() => saveAsGist()}
                >
                    <Icon name="github" /> &nbsp;
                    Save as Gist
                </Button>
            }

            {session &&
                <Button icon fluid style={{ marginBottom: "5px" }}
                    onClick={() => runPipeline()}
                >
                    <Icon name="github" /> &nbsp;
                    Run pipeline
                </Button>
            }

            <CopyToClipboard fluid text={yamlPipeline}
                onCopy={() => setCopied(true)}>
                <Button primary icon>
                    <Icon name="copy" /> &nbsp;
                    {copied ? 'Copied' : 'Copy to pipeline'}
                </Button>
            </CopyToClipboard>
            <Editor
                value={yamlPipeline}
                onValueChange={code => setYamlPipeline(code)}
                highlight={code => highlight(code, languages.yaml)}
                padding={10}
                style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 12,
                    margin: "10px",
                    border: "1px solid black"
                }}
            />
        </>

    )
}

export default PipelineResult;