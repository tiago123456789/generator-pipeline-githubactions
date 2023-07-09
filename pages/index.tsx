import React from 'react'
import {
  Grid,
  Segment,
} from 'semantic-ui-react'

import Footer from "../components/Footer"
import ResponsiveContainer from "../components/ResponsiveContainer"
import PipelineForm from "../components/PipelineForm"
import { PipelineContextProvider } from '../contexts/PipelineContext';
import PipelineResult from '../components/PipelineResult';

const HomepageLayout = () => {
  return (
    <ResponsiveContainer>
      <Segment style={{ padding: '0em' }} vertical>
        <PipelineContextProvider>
          <Grid celled='internally' columns='equal' stackable>
            <Grid.Row textAlign='left'>
              <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                <PipelineForm />
              </Grid.Column>
              <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                <PipelineResult />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </PipelineContextProvider>
      </Segment>
      
      <Segment inverted vertical style={{ padding: '5em 0em' }}>
        <Footer />
      </Segment>
    </ResponsiveContainer>
  )
}

export default HomepageLayout