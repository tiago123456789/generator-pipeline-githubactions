import React, { useEffect, useState } from 'react'
import {
  Button,
  Grid,
  Form,
  Card
} from 'semantic-ui-react'
import * as YAML from 'json-to-pretty-yaml';
import { usePipeline } from '../contexts/PipelineContext';
import pipelineExamples from "../data/pipelines.json"

const PipelineForm = () => {
  const { setYamlPipeline } = usePipeline()
  const [pipeline, setPipeline] = useState(pipelineExamples[0])



  function addNewParam(stepPostion) {
    const data = pipeline;
    data.steps[stepPostion].params.push({
      key: "", value: ""
    })
    setPipeline({ ...data })
  }

  function removeParam(stepPostion, position) {
    const data = pipeline;
    delete data.steps[stepPostion].params[position]
    setPipeline({ ...data })
  }

  function removeEnv(stepPostion, position) {
    const data = pipeline;
    delete data.steps[stepPostion].envs[position]
    setPipeline({ ...data })
  }

  function removeStep(stepPostion) {
    const data = pipeline;
    delete data.steps[stepPostion]
    setPipeline({ ...data })
  }

  function addNewEnv(stepPostion) {
    const data = pipeline;
    data.steps[stepPostion].envs.push({
      key: "", value: ""
    })
    setPipeline({ ...data })
  }

  function addNewStep() {
    const data = pipeline
    data.steps.push({
      name: "",
      action: "",
      shell: "",
      params: [],
      envs: [],
    })
    setPipeline({ ...data })
  }

  function onChangeInputValue(key, event) {
    if (key == 'jobName') {
      event.target.value = event.target.value.toLowerCase().replace(/\s/, "-")
    }
    setPipeline({ ...pipeline, [key]: event.target.value })
  }

  function onChangeInputValueName(stepPosition, event) {
    const data = pipeline;
    data.steps[stepPosition]['name'] = event.target.value;
    setPipeline({ ...pipeline })
  }

  function onChangeInputValueShell(stepPosition, event) {
    const data = pipeline;
    data.steps[stepPosition]['shell'] = event.target.value;
    setPipeline({ ...pipeline })
  }

  function onChangeInputValueAction(stepPosition, event) {
    const data = pipeline;
    data.steps[stepPosition]['action'] = event.target.value;
    setPipeline({ ...pipeline })
  }

  function onChangeInputValueParam(stepPosition, paramPosition, key, event) {
    const data = pipeline;
    data.steps[stepPosition].params[paramPosition][key] = event.target.value;
    setPipeline({ ...pipeline })
  }

  function onChangeInputValueEnv(stepPosition, paramPosition, key, event) {
    const data = pipeline;
    data.steps[stepPosition].envs[paramPosition][key] = event.target.value;
    setPipeline({ ...pipeline })
  }

  function generatePipeline() {
    const dataToGenereatePipeline = {
      name: pipeline.name,
      on: {
        [pipeline.event]: {
          branches: [pipeline.branch]
        }
      },
      jobs: {
        [pipeline.jobName]: {
          "runs-on": pipeline.os,
        }
      }
    }

    const steps = []
    for (let index = 0; index < pipeline.steps.length; index += 1) {
      const step = pipeline.steps[index];
      const newStep = {}

      if (step.name.length > 0) {
        newStep["name"] = step.name
      }

      if (step.action.length > 0) {
        newStep["uses"] = step.action
      }

      if (step.shell.length > 0) {
        newStep["run"] = step.shell
      }

      if (step.params[0] && step.params[0].key.length > 0) {
        const params = {}
        step.params.forEach(param => {
          params[param.key] = param.value
        })
        newStep["with"] = params;
      }

      if (step.envs[0] && step.envs[0].key.length > 0) {
        const envs = {}
        step.envs.forEach(env => {
          envs[env.key] = env.value
        })
        newStep["env"] = envs
      }

      steps.push(newStep)
    }

    dataToGenereatePipeline.jobs[pipeline.jobName]["steps"] = steps;
    setYamlPipeline(YAML.stringify(dataToGenereatePipeline))
  }

  useEffect(() => {
    generatePipeline()
  }, [pipeline])

  function renderParameters(stepPostion) {
    return (
      pipeline.steps[stepPostion].params.map((param, index) => {
        return (
          <Card fluid key={index}>
            <Card.Header>
              <Button onClick={() => removeParam(stepPostion, index)}
                color="red" align="right">
                Remove
              </Button>
            </Card.Header>

            <Card.Content>

              <Grid columns={2}>
                <Grid.Column>
                  <input
                    value={param.key}
                    onChange={(event) => onChangeInputValueParam(stepPostion, index, "key", event)}
                    placeholder='Key name' />
                </Grid.Column>
                <Grid.Column>
                  <input
                    value={param.value}
                    onChange={(event) => onChangeInputValueParam(stepPostion, index, "value", event)}
                    placeholder='Value of key' />
                </Grid.Column>
              </Grid>
            </Card.Content>
          </Card>
        )
      })
    )
  }

  function renderEnvs(stepPostion) {
    return (
      pipeline.steps[stepPostion].envs.map((env, index) => {
        return (
          <Card fluid key={index}>
            <Card.Header>
              <Button
                onClick={() => removeEnv(stepPostion, index)}
                color="red" align="right">
                Remove
              </Button>
            </Card.Header>

            <Card.Content>

              <Grid columns={2}>
                <Grid.Column>
                  <input
                    value={env.key}
                    onChange={(event) => onChangeInputValueEnv(stepPostion, index, "key", event)}
                    placeholder='Key name' />
                </Grid.Column>
                <Grid.Column>
                  <input
                    value={env.value}
                    onChange={(event) => onChangeInputValueEnv(stepPostion, index, "value", event)}
                    placeholder='Value of key' />
                </Grid.Column>
              </Grid>
            </Card.Content>
          </Card>
        )
      })
    )
  }

  function renderSteps() {
    return (
      pipeline.steps.map((step, index) => {
        return (
          <Card fluid key={index}>
            <Card.Header onClick={() => removeStep(index)}>
              <Button color="red" >
                Remove
              </Button>
            </Card.Header>

            <Card.Content>
              <Form.Field style={{ marginLeft: "10px" }}>
              <label>Name:</label>
                <input
                  value={pipeline.steps[index].name}
                  onChange={(event) => onChangeInputValueName(index, event)}
                  placeholder='Run tests' />
                <br />
                <br />
                <label>Action:</label>
                <input
                  value={pipeline.steps[index].action}
                  onChange={(event) => onChangeInputValueAction(index, event)}
                  placeholder='pipeline to run the application tests' />
                <br />
                <br />
                <label>Shell command:</label>
                <input
                  value={pipeline.steps[index].shell}
                  onChange={(event) => onChangeInputValueShell(index, event)}
                  placeholder='npm run build && npm run test' />
                <br />
                <br />
                <label>Parameters:</label>
                {renderParameters(index)}

                <Button primary align="right" onClick={() => addNewParam(index)}>
                  Add parameter
                </Button>
                <br />
                <br />
                <label>Environments:</label>
                {renderEnvs(index)}
                <Button primary align="right" onClick={() => addNewEnv(index)}>
                  Add env
                </Button>
              </Form.Field>
            </Card.Content>
          </Card>
        )
      })
    )
  }

  return (
    <Form>
      <Form.Field>
        <label>Pipeline name:</label>
        <input
          value={pipeline.name}
          onChange={(event) => onChangeInputValue("name", event)}
          placeholder='Pipeline CI' />
      </Form.Field>
      <Form.Field>
        <label>How to trigger pipeline?</label>
        <select
          onChange={(event) => onChangeInputValue("event", event)}
        >
          <option
            value=""
          >Select one option</option>
          <option
            value="pull_request"
          >Pull request</option>
          <option
            value="push">Push</option>
        </select>
      </Form.Field>
      <Form.Field>
        <label>Trigger pipeline to branch?</label>
        <select
          onChange={(event) => onChangeInputValue("branch", event)}
        >
          <option value="" >Select one option</option>
          <option
            value="master" >Master</option>
          <option
            value="main">Main</option>
          <option
            value="staging">Staging</option>
          <option
            value="develop">Develop</option>
        </select>
      </Form.Field>

      <Form.Field>
        <label>Run pipeline in OS?</label>
        <select value={pipeline.os}
          onChange={(event) => onChangeInputValue("os", event)}
        >
          <option value="">Select one below</option>
          <option
            value="ubuntu-latest">Ubuntu</option>
          <option
            value="macos-latest">MacOs</option>
        </select>
      </Form.Field>


      <Card fluid>
        <Card.Content>
          <Form.Field>
            <label>Job name:</label>
            <input
              value={pipeline.jobName}
              onChange={(event) => onChangeInputValue("jobName", event)}
              placeholder='pipeline to run the application tests' />
          </Form.Field>
          <Form.Field>
            <label>Steps</label>
            {renderSteps()}

            <Button primary onClick={() => addNewStep()}>
              Add new step
            </Button>
          </Form.Field>
        </Card.Content>
      </Card>
    </Form>
  )
}

export default PipelineForm;