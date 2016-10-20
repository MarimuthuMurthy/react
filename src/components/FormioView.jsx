import React from 'react';
import { connect } from 'react-redux';
import { default as storeShape } from 'react-redux/lib/utils/storeShape';
import { propTypes } from 'react-router';
import { deepEqual } from '../util';

export default class extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.router = context.router;
    this.store = context.store;
  }

  static contextTypes = {
    router: propTypes.routerContext,
    store: storeShape
  }

  componentWillMount = () => {
    if (typeof this.initialize === 'function') {
      this.initialize(this.store, this.props, this.router);
    }
  }

  componentWillReceiveProps = ({ params, location }) => {
    // If params or location have changed we are on a new page.
    if (!deepEqual(params, this.props.params) || location !== this.props.location) {
      if(typeof this.terminate === 'function') {
        this.terminate(this.store, this.props, this.router);
      }
      if(typeof this.initialize === 'function') {
        this.initialize(this.store, this.props, this.router);
      }
    }
  }

  componentWillUnmount = () => {
    if (typeof this.terminate === 'function') {
      this.terminate(this.store, this.props, this.router);
    }
  }

  render = () => {
    const Component = connect(
      this.mapStateToProps,
      // Adds router to the end of mapDispatchToProps.
      (...args) => {
        if (typeof this.mapDispatchToProps === 'function') {
          return this.mapDispatchToProps(...args, this.router);
        }
        return {};
      }
    )(this.container);
    return <Component { ...this.props }></Component>;
  }
}