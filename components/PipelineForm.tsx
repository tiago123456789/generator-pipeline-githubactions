import React, { Component, useState } from 'react'
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Segment,
  Sidebar,
  Checkbox, 
  Form, 
  Card
} from 'semantic-ui-react'

const PipelineForm = () => {
    const [pipeline, setPipeline] = useState({
        name: "",
        event: "",
        branch: "",
        os: "",
        jobName: "",
        steps: [
          {
                action: "",
                params: [
                    { key: "host", value: "localhost" },
                    { key: "port", value: "22" }
                ],
                envs: [
                    { key: "USERNAME", value: "${ secrets.USERNAME }" },
                    { key: "PASSWORD", value: "${ secrets.PASSWORD }" }
                ],
            }
          ]
    })

    
    
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
      console.log("PASSED ON HERE")
      const data = pipeline
      data.steps.push({
        action: "",
        params: [],
        envs: [],
      })
      setPipeline({ ...data })
    }

    function onChangeInputValue(key, event) {
      setPipeline({ ...pipeline, [key]: event.target.value })
    }

    function renderParameters(stepPostion) {
        return (
            pipeline.steps[stepPostion].params.map((param, index) => {
                return (
                    <Card fluid key={index}>
                        <Card.Header>
                            <Button onClick={() => removeParam(stepPostion, index) }
                             color="red" align="right">
                                Remove
                            </Button>
                                </Card.Header>

                                <Card.Content>
                                    
                                    <Grid columns={2}>
                                        <Grid.Column>
                                            <input 
                                            value={param.key}
                                            placeholder='Key name' />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <input
                                            value={param.value}
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
                                        placeholder='Key name' />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <input
                                        value={env.value}
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
                      <Button color="danger" >
                        Remove
                      </Button>
                    </Card.Header>

                          <Card.Content>
                          <Form.Field style={{ marginLeft: "10px"}}>
                            <label>Action:</label>
                            <input placeholder='pipeline to run the application tests' />
                            <br/>
                            <label>Parameters:</label>
                            {renderParameters(index)}

                            <Button primary align="right" onClick={() => addNewParam(index)}>
                                Add parameter
                            </Button>
                            <br/>
                            <br/>
                            <label>Environments:</label>
                            {renderEnvs(index)}
                            <Button primary align="right"  onClick={() => addNewEnv(index)}>
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
                    <select>
                      <option value="">Select one below</option>
                      <option 
                      onChange={(event) => onChangeInputValue("os", event)}
                      value="ubuntu-latest">Ubuntu</option>
                      <option 
                      onChange={(event) => onChangeInputValue("os", event)}
                      value="macos-latest">MacOs</option>
                    </select>
                  </Form.Field>


                  <Card fluid>
                    <Card.Content>
                      <Form.Field>
                        <label>Pipeline job</label>
                        <input 
                          value={jobName}
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
                  <Button type="submit"
                   >Generate pipeline</Button>
                </Form>
    )
}

export default PipelineForm;