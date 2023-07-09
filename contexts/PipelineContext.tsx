import { createContext, useContext, useState } from "react"

interface PipelineContextInterface {
    yamlPipeline: string;
    setYamlPipeline: Function
}

export const PipelineContext = createContext({} as PipelineContextInterface)

export function PipelineContextProvider({ children }) {
    const [yamlPipeline, setYamlPipeline] = useState(`apiVersion: apps/v1
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
    )

    return (
        <PipelineContext.Provider value={{
            yamlPipeline, setYamlPipeline
        }}>
            { children }
        </PipelineContext.Provider>
    )
}

export function usePipeline() {
    return useContext(PipelineContext)
}