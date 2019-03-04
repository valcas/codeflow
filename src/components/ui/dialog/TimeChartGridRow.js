import React, {PureComponent} from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import TimeChartDetailTooltip from './TimeChartDetailTooltip';

export default class TimeChartGridRow extends PureComponent {

    constructor()   {

        super();
        this.gridRow = React.createRef();

    }

    paintRow(targetCanvasWidth, targetCanvasX, lastBarX)  {

        var canvas = this.gridRow.current;
        var canvasWidth = canvas.offsetWidth;
        var canvasHeight = canvas.offsetHeight;
        
        canvas.width = canvasWidth;
        canvas.height = canvas.offsetHeight;
 
        var ctx = canvas.getContext("2d");
        ctx.font = "16px Arial";

        ctx.fillText(this.props.step.stepname, 15, 20);
        this.createLine(ctx, this.props.index, 0, canvasWidth);

        var width = targetCanvasWidth * this.props.step.durationPercent / 100;
        ctx.lineWidth = 45;
        ctx.strokeStyle = "rgba(41, 171, 226, 0.5)";
        ctx.beginPath();
        ctx.moveTo(targetCanvasX + lastBarX, 10);
        ctx.lineTo(targetCanvasX + lastBarX + width, 10);
        ctx.stroke();

        if (this.props.last)    {
            this.createLine(ctx, this.props.index, 30, canvasWidth);
        }

    }

    createLine(ctx, i, offsetY, canvasWidth)    {

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#CCCCCC';
        ctx.beginPath();
        ctx.moveTo(0, offsetY);
        ctx.lineTo(canvasWidth, offsetY);
        ctx.stroke();

    }

    rowEnter(e) {
        this.props.parent.rowEnter(e, this.props.index);
    }

    rowExit(e) {
        this.props.parent.rowExit(e, this.props.index);
    }

    render()  {

        var top = 90 + (this.props.index * 30);
        return(
            <div key={this.props.index} onMouseEnter={(e) => this.rowEnter(e)} onMouseLeave={(e) => this.rowExit(e)} className="timechart-grid-row" style={{height:'30px', width:'99.99%', position:'absolute', top:top + 'px'}}>
                <canvas style={{width:'100%', height:'30px'}} ref={this.gridRow}></canvas>
            </div>
        )
    
    }

}