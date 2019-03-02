import React, {PureComponent} from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import TimeChartDetailTooltip from './TimeChartDetailTooltip';
import TimeChartGridRow from './TimeChartGridRow';

export default class TimeChartTimeGrid extends PureComponent {

    constructor()   {

        super();
        this.gridTable = React.createRef();
        this.gridCanvasCell = React.createRef();
        this.tooltipPopup = React.createRef();
        this.timeGridRows = [];

    }

    rowEnter(e, index)  {
        let y = e.target.offsetTop;
        let step = this.props.graphData.steps[index];
        this.tooltipPopup.current.setState({visible:true, yPos:e.target.offsetParent.offsetTop + 40, step:step})
    }

    rowExit(e, index)  {
        this.tooltipPopup.current.setState({visible:false, yPos:0})
    }

    componentDidMount() {
        
        var stepdata = this.props.graphData.steps;

        var tableWidth = this.gridTable.current.offsetWidth;
        var canvas = this.gridCanvasCell.current;
        var canvasWidth = canvas.offsetWidth;
        
        var targetCanvasX = tableWidth * 0.2;
        var targetCanvasWidth = tableWidth - targetCanvasX;

        canvas.width = canvasWidth;
        canvas.height = canvas.offsetHeight;
        
        var offsetY = 60;
        var lastBarX = 0;
        
 
        for (var i = 0; i < stepdata.length; i++)   {
            var width = targetCanvasWidth * stepdata[i].durationPercent / 100;
            this.timeGridRows[i].paintRow(targetCanvasWidth, targetCanvasX, lastBarX);
            lastBarX += width 
        }
        
    }

    render()  {

        var stepdata = this.props.graphData.steps;

        this.timeGridRows = new Array(stepdata.length);

        return(
            <div style={{height:'100%', width:'100%'}}>
                <table ref={this.gridTable} style={{width:'100%', height:'90%', 'borderCollapse':'collapse'}}>
                <tbody>
                    <tr>
                        <td style={{width:'100%', 'verticalAlign': 'top'}} ref={this.gridCanvasCell}>
                        {stepdata.map((n, index) => {
                            return <TimeChartGridRow parent={this} step={n} index={index} last={(index + 1) == stepdata.length} ref={(row) => {this.timeGridRows[index] = row}}/>
                        })}
                        </td>
                    </tr>
                </tbody>
                </table>
                <TimeChartDetailTooltip ref={this.tooltipPopup}/>
           </div>
        )
    
    }

}