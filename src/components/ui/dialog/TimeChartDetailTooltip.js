import React, {PureComponent} from 'react';

export default class TimeChartDetailTooltip extends PureComponent {

    constructor()   {

        super();
        this.state = {visible:false, yPos:100};

    }

    formatDate(date)  {
        if (date == null) {
          return null;
        } else {
          var tempDate = new Date(+date);
          return tempDate.getHours() + ":" + tempDate.getMinutes() + ":" + tempDate.getSeconds() + ":" + tempDate.getMilliseconds();
        }
    }    

    render()    {

        var pStyle = {
            display: (this.state.visible ? 'block' : 'none'),
            top: this.state.yPos
        }

        var step = this.state.step ? this.state.step : {duration:0, durationPercent:0, stepinfo:{timestamp:null}};

        return(
            <div style={pStyle} className="timechart-tooltip-container">
                <table>
                <tr>
                        <td className="info-prompt">Duration (seconds): </td>
                        <td className="info-data">{(step.duration / 1000).toFixed(5)} s</td>
                    </tr>
                    <tr>
                        <td className="info-prompt">Duration (percent): </td>
                        <td className="info-data">{step.durationPercent.toFixed(5)} %</td>
                    </tr>
                    <tr>
                        <td className="info-prompt">Timestamp: </td>
                        <td className="info-data">{this.formatDate(step.stepinfo.timestamp)}</td>
                    </tr>
                </table>
            </div>
        );
    }
}