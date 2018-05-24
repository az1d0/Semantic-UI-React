import _ from 'lodash'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import DocumentTitle from 'react-document-title'
import { withRouter } from 'react-router'
import { Grid, Icon } from 'semantic-ui-react'

import componentInfoShape from 'docs/app/utils/componentInfoShape'
import { scrollToAnchor, examplePathToHash, getFormattedHash } from 'docs/app/utils'
import ComponentDocHeader from './ComponentDocHeader'
import ComponentDocLinks from './ComponentDocLinks'
import ComponentDocSee from './ComponentDocSee'
import ComponentExamples from './ComponentExamples'
import ComponentProps from './ComponentProps'
import ComponentSidebar from './ComponentSidebar'

const topRowStyle = { margin: '1em' }
const exampleEndStyle = {
  textAlign: 'center',
  opacity: 0.5,
  paddingTop: '50vh',
}

class ComponentDoc extends Component {
  static childContextTypes = {
    onPassed: PropTypes.func,
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
    info: componentInfoShape.isRequired,
  }

  state = {}

  componentWillMount() {
    const { history } = this.props

    if (window.location.hash) {
      const activePath = getFormattedHash(window.location.hash)
      history.replace(`${window.location.pathname}#${activePath}`)
      this.setState({ activePath })
    }
  }

  getChildContext() {
    return {
      onPassed: this.handleExamplePassed,
    }
  }

  componentWillReceiveProps({ info }) {
    if (info.displayName !== this.props.info.displayName) {
      this.setState({ activePath: undefined })
    }
  }

  handleExamplePassed = (e, { examplePath }) => {
    this.setState({ activePath: examplePathToHash(examplePath) })
  }

  handleExamplesRef = examplesRef => this.setState({ examplesRef })

  handleSidebarItemClick = (e, { examplePath }) => {
    const { history } = this.props
    const activePath = examplePathToHash(examplePath)

    history.replace(`${location.pathname}#${activePath}`)
    // set active hash path
    this.setState({ activePath }, scrollToAnchor)
  }

  render() {
    const { info } = this.props
    const { activePath, examplesRef } = this.state

    return (
      <DocumentTitle title={`${info.displayName} | Semantic UI React`}>
        <Grid>
          <Grid.Row style={topRowStyle}>
            <Grid.Column>
              <ComponentDocHeader
                displayName={info.displayName}
                description={_.join(info.description, ' ')}
              />
              <ComponentDocSee displayName={info.displayName} />
              <ComponentDocLinks
                displayName={info.displayName}
                parentDisplayName={info.parentDisplayName}
                repoPath={info.repoPath}
                type={info.type}
              />
              <ComponentProps displayName={info.displayName} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns='equal'>
            <Grid.Column>
              <div ref={this.handleExamplesRef}>
                <ComponentExamples displayName={info.displayName} />
              </div>
              <div style={exampleEndStyle}>
                This is the bottom <Icon name='pointing down' />
              </div>
            </Grid.Column>
            <Grid.Column computer={5} largeScreen={4} widescreen={4}>
              <ComponentSidebar
                activePath={activePath}
                displayName={info.displayName}
                examplesRef={examplesRef}
                onItemClick={this.handleSidebarItemClick}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </DocumentTitle>
    )
  }
}

export default withRouter(ComponentDoc)
