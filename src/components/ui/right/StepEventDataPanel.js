import React, {Component} from 'react';

export default class StepEventDataPanel extends Component {

    getPayload()    {
        if (this.props.data)    {
            if (typeof(this.props.data) == 'object')    {
                return JSON.stringify(this.props.data, null, 2);
            } else if (typeof(this.props.data) == 'string' && (this.props.data.startsWith('{')))    {
                var json = JSON.parse(this.props.data);
                return JSON.stringify(json, null, 2);
            } else {
                return this.props.data;
            }
        }

    }

    render()    {
        return (
            <div className="info-container" style={{height:'100%'}}>
                <div className="right-data-panel">
                    <pre style={{whiteSpace: 'pre-wrap'}}>
                        {this.getPayload()}
                    </pre>
                </div>
            </div>
        )
    }

}