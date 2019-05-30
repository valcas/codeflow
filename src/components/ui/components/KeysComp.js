import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import compose from 'recompose/compose';
import {connect} from 'react-redux'
import store from '../../redux/CodeflowStore';

import playIcon from '../../../images/play.svg';
import filterImage from '../../../images/filter.svg';
import filterRemoveImage from '../../../images/filter-remove.svg';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 3630,
    }
});

const filterImages = {
    add : {image:filterImage},
    remove : {image:filterRemoveImage, inverse:true}
};
  
class KeysComp extends Component {

    constructor(props)  {
        super();
        this.dropiicon = React.createRef();
        this.state = {keysDropped:false};
    }

    expand()  {
        this.setState({keysDropped:!this.state.keysDropped});
    }

    filterHandler(key) {
        if (key)  {
          store.dispatch({type: 'FILTER_KEY', payload:{key:key}});
        }
      }
    
    removeFilterHandler(key) {
        if (key)  {
            store.dispatch({type: 'REMOVE_FILTER_KEY', payload:{key:key}});
          }
      }

    getFilterImageClass(key, filterImage)    {
    
        var image = filterImage.inverse ? 'keyscomp-icon icon-disabled' : 'keyscomp-icon';
        if(this.props.activegraph.graph.currentfilter.keys) {
            this.props.activegraph.graph.currentfilter.keys.map((fKey) => {
                if ((key.id === fKey.id) && (key.value === fKey.value))  {
                    image = filterImage.inverse ? 'keyscomp-icon' : 'keyscomp-icon icon-disabled';
                }
            });
        }
        
        return image;
    
    }
    
    render() {

        var me = this;
        
        const { classes } = this.props;

        var renderInfo = {};
        renderInfo.arrowIconClass = 'small-icon keyscomp-arrow' + (this.state.keysDropped ? ' icon-rotate-90' : '');
        renderInfo.dispPanelClass = (this.state.keysDropped ? 'keyscomp-detail-panel' : 'keyscomp-detail-panel-hidden');
        renderInfo.filtericon = 'keyscomp-icon';
        renderInfo.removefiltericon = 'keyscomp-icon icon-disabled';

        var keys = this.props.keys ? this.props.keys : [];

        return (
            <div>
                <div className='keyscomp'>
                    <div className="keyscomp-text">{keys.length} key(s)</div>
                    <img ref={me.timeChartDialog} className={renderInfo.arrowIconClass} src={playIcon} onClick={() => {this.expand()}}/>
                </div>
                <div className={renderInfo.dispPanelClass}>
                    <table>
                        <tbody>
                        {keys.map((key, index) => {
                            return (
                                <tr key={index}>
                                    <td className="keyscomp-detail-text">{key.id}: </td>
                                    <td className="keyscomp-detail-text">{key.value}</td>
                                    <td className="keyscomp-detail-text">
                                        <div className="keyscomp-icon-container">
                                            <img className={this.getFilterImageClass(key, filterImages.add)} ref={me.timeChartDialog} src={filterImages.add.image} onClick={() => {this.filterHandler(key)}}/>
                                            <img className={this.getFilterImageClass(key, filterImages.remove)} ref={me.timeChartDialog} src={filterImages.remove.image} onClick={() => {this.removeFilterHandler(key)}}/>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );

    }

}

const mapDispatchToProps = (dispatch) => {
    return {};
}

function mapStateToProps(state) {
return {
    activegraph: state.gr.activegraph,
    selectedstep: state.gr.selectedstep
};
}
// export default compose(
// connect(mapStateToProps, mapDispatchToProps),
// withStyles(styles)
// )(KeysComp);
export default KeysComp;