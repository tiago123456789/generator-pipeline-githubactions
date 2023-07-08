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
} from 'semantic-ui-react'
import HomepageHeading from "./HomePageHeading"

  
const MobileContainer = ({ children }) => {
  
      return (
        <div as={Sidebar.Pushable} at='mobile'>
          <Sidebar.Pushable>
            <Sidebar.Pusher>
              <Segment
                inverted
                textAlign='center'
                style={{ minHeight: 350, padding: '1em 0em' }}
                vertical
              >
                <Container>
                  <Menu inverted pointing secondary size='large'>
                    <Menu.Item position='right'>
                      <Button as='a' inverted>
                        <Icon name="github"/>
                        Log in
                      </Button>
                    </Menu.Item>
                  </Menu>
                </Container>
                <HomepageHeading mobile />
              </Segment>
              {children}
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </div>
      )
  }
  
  MobileContainer.propTypes = {
    children: PropTypes.node,
  }
  
  const ResponsiveContainer = ({ children }) => (
    <>
      <MobileContainer>{children}</MobileContainer>
    </>
  )
  
  ResponsiveContainer.propTypes = {
    children: PropTypes.node,
  }

  export default ResponsiveContainer;