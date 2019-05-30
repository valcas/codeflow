import React, {PureComponent} from 'react';

import $ from 'jquery'; 

export default class BasicMarker extends PureComponent {

  constructor(props) {
    super(props);
    this.marker = React.createRef();
  }

  componentDidMount(e) {
    $(this.marker.current).removeClass('marker-basic-highlight');
  }

  componentDidUpdate() {

    var _this = this;
    var curr = $(this.marker.current);

    if (this.props.stepdata.temp && this.props.stepdata.temp.selectedProcess)  {      
      curr.addClass('marker-basic-selected-process');
    } else {
      curr.removeClass('marker-basic-selected-process');
    }

    if (this.props.stepdata.temp && this.props.stepdata.temp.newdata)  {

      if ( ! curr.hasClass('marker-basic-highlight')) {

        curr.addClass('marker-basic-highlight') 
        window.setTimeout(function()  {
          curr.removeClass('marker-basic-highlight') 
        }, 500);
        
      }
     
      _this.props.stepdata.temp.newdata = false;
      
    }

    if (this.props.stepdata.temp && this.props.stepdata.temp.selected)  {
      curr.addClass('marker-basic-selected');
    } else {
      curr.removeClass('marker-basic-selected');
    }
    
    console.log(this.props.stepdata.newdata);

  }

  render() {

    const { classes } = this.props;

    return (
      <div className='marker-canvas' style={this.props.style}>
          <div ref={this.marker} className="marker-basic marker-basic-highlight">
            <div className="marker-basic-text">{this.props.badgeContent}</div>
          </div>
      </div>
    );

  }

}
