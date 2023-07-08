import PropTypes from 'prop-types'
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
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-yaml';
import 'prismjs/themes/prism.css';

import Footer from "../components/Footer"
import ResponsiveContainer from "../components/ResponsiveContainer"
import PipelineForm from "../components/PipelineForm"

const HomepageLayout = () => {
  const [code, setCode] = useState(`apiVersion: apps/v1
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
       name: nginx`)

    return (
        <ResponsiveContainer> 
            <Segment style={{ padding: '0em' }} vertical>
            <Grid celled='internally' columns='equal' stackable>
                <Grid.Row textAlign='left'>
                
                <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                <PipelineForm/>
                </Grid.Column>
                <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                <Editor
                        value={code}
                        onValueChange={code => setCode(code)}
                        highlight={code => highlight(code, languages.yaml)}
                        padding={10}
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 12,
                            margin: "10px",
                            border: "1px solid black"
                        }}
                        />
                </Grid.Column>
                </Grid.Row>
            </Grid>
            </Segment>


            <Segment inverted vertical style={{ padding: '5em 0em' }}>
            <Footer />
            </Segment>
        </ResponsiveContainer>
        )
}

export default HomepageLayout