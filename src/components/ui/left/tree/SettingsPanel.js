import React, {Component} from 'react';

import PortSetting from './PortSetting';

export default class SettingsPanel extends Component {

    render()    {

        return (
            <div>                
                <div><PortSetting settings={this.props.settings}/></div>
                <div className="info-container" style={{marginBottom:'5px'}}>
                    <a className="swagger-link" 
                    onClick={(e) => {window.open('http://localhost:8081/docs')}}
                    >API Documentation...</a>
                </div>
            </div>
        );

    }

}