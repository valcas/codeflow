import React, {PureComponent} from 'react';

export default class TimeChartTicker extends PureComponent {


    constructor()   {

        super();
        this.tickerCanvas = React.createRef();

    }

    componentDidMount() {
        
        var interval = this.props.graphData.interval;

        var canvas = this.tickerCanvas.current;
        var canvasWidth = canvas.offsetWidth;
        var canvasHeight = canvas.offsetHeight;
        var tenths = parseInt(this.props.graphData.totalDuration / interval);

        canvas.width = canvasWidth;
        canvas.height = canvas.offsetHeight;
        
        var ctx = canvas.getContext("2d");  

        var offsetY = 80;

        ctx.strokeStyle = '#888888';
        ctx.beginPath();
        ctx.moveTo(0, offsetY);
        ctx.lineTo(0, canvasHeight);
        ctx.stroke();    
        ctx.fillText(0, 0, offsetY - 15);

        var period = 0;

        for (var i = 0; i < tenths; i++)    {

            var x = canvasWidth / this.props.graphData.totalDuration * (i + 1) * interval;

            if (i == 0) {
                period = x;
            }
            
            for (let filler = 0; filler < 9; filler++)  {
            
                var fillX = x - period + ((period / 10) * (filler + 1));
                ctx.strokeStyle = '#EEEEEE';
                ctx.beginPath();
                ctx.moveTo(fillX, offsetY + 10);
                ctx.lineTo(fillX, canvasHeight);
                ctx.stroke();    
    
            }

            ctx.strokeStyle = '#888888';
            ctx.beginPath();
            ctx.moveTo(x, offsetY);
            ctx.lineTo(x, canvasHeight);
            ctx.stroke();    

            var label = (i + 1) / 1000 * interval;
            label = label.toFixed(new String(1000 / interval).length - 1);
            ctx.fillText(label, x - 7, offsetY - 15);

        }

        var x = canvasWidth / this.props.graphData.totalDuration * (i + 1) * interval;

        for (let filler = 0; filler < 9; filler++)  {
            
            var fillX = x - period + ((period / 10) * (filler + 1));
            ctx.strokeStyle = '#EEEEEE';
            ctx.beginPath();
            ctx.moveTo(fillX, offsetY + 10);
            ctx.lineTo(fillX, canvasHeight);
            ctx.stroke();    

        }
    
    }

    render()  {
    
        return(
          <div style={{height:'100%'}}>
              <table style={{width:'100%', height:'100%', 'borderCollapse':'collapse'}}>
                <tbody>
                  <tr>
                    <td style={{width:'20%', height:'100%'}}>&nbsp;</td>
                    <td style={{width:'80%', 'verticalAlign': 'top'}}>
                        <canvas style={{width:'100%', height:'99.7%'}} ref={this.tickerCanvas}></canvas>
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>
        )

    }

}
