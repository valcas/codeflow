import React, { Component } from 'react';
import store from '../redux/CodeflowStore';
import {connect} from 'react-redux'
import compose from 'recompose/compose';

class CodeflowServer extends Component {

  constructor(props) {
    super(props);
    this.listening = false;
  }

  startListening()  {

    var _this = this;

    if (this.listening === true) {
      return;
    }
    this.listening = true;

    const bodyparser = require('body-parser');
    const swaggerJSDoc = window.require('swagger-jsdoc');
    const path = require('path');

    var express = window.require('express');
    this.app = express();
    this.app.use(express.urlencoded());
    this.app.use(bodyparser.json({
      strict: false,
    }));
    
/**
 * @swagger
 * /log:
 *   post:
 *     summary: Logger
 *     description: Log a diagram trigger with data
 *     tags:
 *       - Logger
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diagramid:
 *                 type: string
 *               stepid:
 *                 type: string
 *               action:
 *                 type: string
 *               processid:
 *                 type: string
 *               data:
 *                 type: string
 *               timestamp:
 *                 type: "integer"
 *                 format: "int64"
 *     responses:
 *       200:
 *         description: Nothing useful returned
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               default: 'Done'
 */
    this.app.post('/log', function (req, res) {

      if (_this.listening === false) {
        return;
      }
      
      store.dispatch({type: 'DATA_RECEIVED', payload: {data:req.body}});
      res.send('Done')

    });
     
    this.server = this.app.listen(this.props.settings.listenport);

    const swaggerDefinition = {
      info: {
        title: 'CodeFlow',
        version: '1.2.0',
        description: 'Codeflow Logging API',
      },
      host: 'localhost:8081',
      basePath: '/',
    };
    const options = {
      swaggerDefinition,
      apis: [path.resolve('./src/components/server/', 'CodeflowServer.js')],
    };
    const swaggerSpec = swaggerJSDoc(options);

    this.app.get('/swagger.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });

    this.app.get('/docs', (req, res) => {
      res.sendFile(path.resolve('docs', 'redoc.html'));
    });
    
  }

  stopListening()  {

    this.listening = false;

    this.server.close(() => {
      console.log('Process terminated')
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
)(CodeflowServer);
