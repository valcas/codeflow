import React, { Component } from 'react';
import store from '../redux/CodeflowStore';
import {connect} from 'react-redux'
import compose from 'recompose/compose';

class CodeflowServer extends Component {

  constructor(props) {
    super(props);
  }

  startListening()  {
    this.http = window.require('http');
    this.fs = window.require('fs');
    this.querystring = window.require('querystring');

    this.app = window.require('http').createServer(this.handler)
    try {
      this.app.listen(this.props.settings.listenport);
    } catch (e) {
      console.log('port in use');
    } finally {

    }
  }

  stopListening()  {
    this.app.close();
    // this.app.exit();
    // this.app = null;
  }

  handler(req, res)  {

    var me = this;
    var body = '';

    res.writeHead(200);
    res.end('done');

    if (req.method == 'POST') {
        body = '';
    }

    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        var post = window.require('querystring').parse(body);
        // var evt = new CustomEvent('datareceived', { detail: post });
        // window.dispatchEvent(evt);
        store.dispatch({type: 'DATA_RECEIVED', payload: {data:post}});
    });

  }

  render()  {
    if (this.props.settings.listening === true) {
      this.startListening();
    } else {
      this.stopListening();
    }
    return null;
  }

}

const mapDispatchToProps = (dispatch) => {
  return {};
}

function mapStateToProps(state) {
  return {
    settings: state.sr.settings
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
  // withStyles(styles)
)(CodeflowServer);
