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
import { useSession, signIn, signOut } from "next-auth/react"


const MobileContainer = ({ children }) => {
  const { data: session } = useSession()

  return (
    <div>
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
                  {session &&
                    <>
                      
                      Signed in as {session.user.email} &nbsp;
                      <Button  inverted onClick={() => signOut()}>
                        {/* @ts-ignore */}
                      <Image src={session?.user?.picture} avatar /> &nbsp; Sign out
                      </Button>
                    </>
                  }
                  {!session &&
                    <Button as='a' inverted onClick={() => signIn()}>
                      <Icon name="github" />
                      Log in
                    </Button>
                  }
                  {/* <Button as='a' inverted>
                    <Icon name="github" />
                    Log in
                  </Button> */}
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