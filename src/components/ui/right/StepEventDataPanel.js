import React, {Component} from 'react';

export default class StepEventDataPanel extends Component {

    getPayload()    {
        if (this.props.data)    {
            if (this.props.data.startsWith('{'))    {
                var json = JSON.parse(this.props.data);
                return JSON.stringify(json, null, 2);
            } else {
                return this.props.data;
            }
        }

    }

    render()    {
        return (
            <div className="info-container">
                <div className="right-data-panel">
                    <pre style={{whiteSpace: 'pre-wrap'}}>
                        {this.getPayload()}
                    </pre>
                </div>
            </div>
        )
    }

}