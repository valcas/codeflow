import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import compose from 'recompose/compose';
import TimeChartTimeGrid from './TimeChartTimeGrid';
import TimeChartTicker from './TimeChartTicker';

const styles = {
    appBar: {
      position: 'relative',
    },
    flex: {
      flex: 1,
    },
};

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class TimeChartDialog extends PureComponent {

    constructor()   {
        super();

        this.state = {
            inc: 0
        };

        this.open = () =>    {
            this.setState(open:true);
        };

    }

    handleClickOpen()   {
        this.setState({ open: true });
    }

    handleClose(passedState)   {
        passedState.open = false;
        this.setState({ inc: this.state.inc++ });
    }

    buildGraphData()    {

        var graph = this.props.state.graph;

        var startTime = 0;
        var endTime = 0;

        var timeData = {};

        if (graph)  {

            var keys = Object.keys(graph.filterdata);

            for (var i = 0; i < keys.length; i++)   {
                var event = graph.filterdata[keys[i]];
                if (i === 0)    {
                    startTime = event[0].timestamp;
                }
                startTime = Math.min(startTime, event[0].timestamp);
                endTime = Math.max(endTime, event[0].timestamp);
            }

            timeData.totaltime = endTime - startTime;

        }

        return timeData;

    }

    organiseChartData() {

        if (this.props.state.steps != null) {

            var wrapper = {};

            var steps = this.props.state.steps;

            steps.sort(function(a,b) {
                return a.stepinfo.timestamp - b.stepinfo.timestamp;
            });

            var totalDuration = steps[steps.length - 1].stepinfo.timestamp - steps[0].stepinfo.timestamp;
            
            for (var i = 0; i < steps.length; i++)  {

                if (i < (steps.length - 1))   {
                    var duration = steps[i + 1].stepinfo.timestamp - steps[i].stepinfo.timestamp;
                    var durationPercent = duration / totalDuration * 100;
                    steps[i].duration = duration;
                    steps[i].durationPercent = durationPercent;
                }    

            }    

            steps[steps.length - 1].duration = 0;
            steps[steps.length - 1].durationPercent = 0;

            wrapper.interval = Math.pow(10, new String(parseInt(totalDuration)).length - 1);
            wrapper.steps = steps;
            wrapper.totalDuration = totalDuration;
            return wrapper;

        }

    }

    render()  {

        var graphData = this.organiseChartData();
        const { classes } = this.props;

        return(

            <Dialog
                fullScreen
                open={this.props.state.open}
                TransitionComponent={Transition}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                    <IconButton color="inherit" onClick={() => this.handleClose(this.props.state)} aria-label="Close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="title" color="inherit" className={classes.flex}>
                        Process Time Chart
                    </Typography>
                    </Toolbar>
                </AppBar>
                <div className="timechart-gridparent">
                    <div className="timechart-gridelement">
                        <TimeChartTicker graphData={graphData}/>
                    </div>
                    <div className="timechart-gridelement">
                        <TimeChartTimeGrid graphData={graphData}/>
                    </div>
                </div>
            </Dialog>
        )

    }

}

export default compose(
    withStyles(styles)
)(TimeChartDialog);
