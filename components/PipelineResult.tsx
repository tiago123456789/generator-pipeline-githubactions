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
    const [isRunningPipeline, setIsRunningPipeline] = useState(false)
    const [isSavingGist, setIsSavingGist] = useState(false)

    async function runPipeline() {
        try {
            setIsRunningPipeline(true)
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
            aElement.target = '_blank';
            aElement.click();
        } catch (error) {
            console.log(error);
        } finally {
            setIsRunningPipeline(false)
        }
    }

    async function saveAsGist() {
        try {
            setIsSavingGist(true)
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/gists`, {
                content: `${yamlPipeline}`,
            }, {
                headers: {
                    // @ts-ignore
                    Authorization: `Bearer ${session?.user?.accessToken}`
                }
            })
    
            const aElement = document.createElement('a');
            aElement.href = response.data.link;
            aElement.target = '_blank';
            aElement.click();
        } catch(error) {
            console.log(error);
        } finally {
            setIsSavingGist(false)
        }
    }

    useEffect(() => {
        if (copied) [
            setTimeout(() => {
                setCopied(false)
            }, 3000)
        ]
    }, [copied])

    return (
        <>
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
                    {!isRunningPipeline ? 'Run pipeline' : 'Preparing to run pipeline'}
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