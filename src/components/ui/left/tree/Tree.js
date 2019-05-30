import React, {Component} from 'react';

import SettingsPanel from './SettingsPanel'
import store from '../../../redux/CodeflowStore';
import FileStore from '../../../file/FileStore';

import playIcon from '../../../../images/play-white.svg';
import settingsIcon from '../../../../images/baseline-settings-20px.svg';
import deleteIcon from '../../../../images/delete-white.svg';
import sessionIcon from '../../../../images/baseline-call_merge-24px.svg';

import $ from 'jquery'; 

export default class Tree extends Component {

    constructor(props)  {
        super(props);
        this.state = {
            panels:[
                {type:'permanent', title:'Settings', background:'#333', icon:settingsIcon, iconClass:'tree-project-icon'
                    // , panel:<SettingsPanel settings={this.props.settings}/>
                }
            ]
        }
        this.treeContainer = React.createRef();
        this.handleWindowResize();
    }
    
    componentDidMount() {
        this.doWindowResize($(window));
    }

    handleWindowResize()    {

        var _this = this;
        var winObj = $(window);
        winObj.resize(() => {
            _this.doWindowResize(winObj);
        });

    }

    doWindowResize(winObj)    {
        
        var cont = $(this.treeContainer.current);
        var scrollable = cont.find('.tree-project-container-scrollable');

        var offset = 88;
        var height = winObj.height() - offset;
        cont.css('height', height);
        if (scrollable.height() > height)   {
            cont.css({'overflow-y':'scroll'});
        } else {
            cont.css({'overflow-y':'hidden'});
        }

        var leftPanel = cont.closest('#left-drawer-content');
        scrollable.width(leftPanel.width());

        scrollable.find('.tree-project-location-text').each(function() {
            var width = scrollable.width() - 55;
            $(this).css({width:width, maxWidth:width});
        });

    }

    handlePanelClick(panel)    {

        var _this = this;

        if (panel.expanded)  {
            panel.expanded = false;
        } else {
            panel.expanded = true;
        }
        this.setState(this.state);
        window.setTimeout(() => {
            _this.doWindowResize($(window));
        }, 1);
    }

    getArrowClass(panel) {
        var ret = 'tree-project-arrow';
        if (panel.expanded)  {
            ret += ' icon-rotate-90';
        }
        return ret;
    }

    // getPanelContent(panel)  {
    //     if (panel.expanded) {
    //         // return panel.panel;
    //         return <div>test</div>
    //     }
    // }

    handlePanelMouseEnter(e, panel) {
        if (panel.type == 'project')    {
            $(e.target).closest('.tree-project-location').find('.tree-project-project-icon').css('display', 'block');
        }
    }

    handlePanelMouseLeave(e, panel) {
        if (panel.type == 'project')    {
            $(e.target).closest('.tree-project-location').find('.tree-project-project-icon').css('display', 'none');
        }
    }

    handlePanelCloseClick(e, panel) {
        if (panel.type == 'project')    {
            console.log('need to remove project')
            store.dispatch({type: 'CLOSE_PROJECT', payload: {project:panel.project}});
        }
    }

    getFoldersPanel(panel)   {
        if (panel.expanded)  {
            return (
                <div>
                    {this.createProjectPanel(panel.project)}
                </div>
            );
        } else {
            return (<div></div>);
        }
    }

    handleFileClick(project, file)   {
        console.log(project + ':' + file);
        var path = project.location + '\\' + file.path;
        var xml = new FileStore().getFile(path);
        var name = file.path.split('.')[0];
        var graph = {xml:xml, file:path, name:name};
        store.dispatch({type: 'LOAD_GRAPH', payload: {graph:graph}});

    }

    createProjectPanel(project)    {

        return (
            <div>
                {project.files.map(file => {
                    return (
                        <div>
                            <div className="tree-project-file" onClick={() => {this.handleFileClick(project, file)}}>{file.path}</div>
                            {this.getSessionFiles(project, file)}
                        </div>
                    )
                })}
            </div>
        );
    }

    getSessionFiles(project, folder)   {

        if (folder.type == 'folder' && folder.key == 'sessions')  {
            return (
                <div>
                    {folder.files.map(file => {
                        return (
                            <div className="tree-project-file" style={{display:'flex'}} 
                                    onClick={() => {this.handleOpenSession(project, folder, file)}}>
                                <img className="icon-toolbar-icon icon-rotate-90" src={sessionIcon} 
                                    style={{display:'inline-block', width:'20px', margin:'0px'}}/>
                                <div style={{display:'inline-block', padding:'3px 0px 0px 5px'}}>{file}</div>                                
                            </div>
                        )
                    })}
                </div>
            )
        } else {
            return '';
        }

    }

    handleOpenSession(project, folder, file) {
        console.log(file);
        store.dispatch({type: 'RESTORE_SESSION_DATA', payload: {filename:project.location + '\\sessions\\' + file}});
    }

    organiseProjects()  {

        var _this = this;

        this.state.panels.map((panel, index) => {
            if (panel.type == 'project')    {
                var exists = false;
                this.props.settings.projects.map(project => {
                    if ((panel.project) && project.location == panel.project.location) {
                        exists = true;
                    }
                });
                if ( ! exists)  {
                    _this.state.panels.splice(index, 1);
                }
            }
        });

        this.props.settings.projects.map(project => {
            
            var exists = false;

            _this.state.panels.map(panel => {

                if (panel.type == 'project')    {
                    if (project.location == panel.project.location) {
                        exists = true;
                        panel.project = project;
                    }
                    
                }
                
            });            
            
            if ( ! exists)  {
                var newPanel = {type:'project', title:project.location};
                // newPanel.panel = _this.createProjectPanel(project);
                newPanel.project = project;
                newPanel.icon = deleteIcon;
                newPanel.iconClass = 'tree-project-project-icon';
                _this.state.panels.push(newPanel);
            }

        });

    }

    render()    {

        this.organiseProjects();
        var projects = this.props.settings.projects ? this.props.settings.projects : [];

        return (
            <div className="tree-project-container" style={{width:'100%'}} ref={this.treeContainer}>
                <div className="tree-project-container-scrollable">
                    {this.state.panels.map((panel, index) => {
                        var css = {display:'-webkit-box', width:'-webkit-fill-available'};
                        if (panel.background)   {
                            css.backgroundColor = panel.background;
                        }
                        return (
                            <div key={index}>
                                <div className="tree-project-location" style={css}
                                    onMouseEnter={(e) => {this.handlePanelMouseEnter(e, panel)}}
                                    onMouseLeave={(e) => {this.handlePanelMouseLeave(e, panel)}}
                                    onClick={(e) => {this.handlePanelClick(panel)}}                                 
                                >
                                    <img src={playIcon} className={this.getArrowClass(panel)}/>
                                    <div title={panel.title} className="tree-project-location-text">{panel.title}</div>
                                    <div style={{paddingTop:'3px'}} onClick={(e) => {this.handlePanelCloseClick(e, panel)}}>
                                        <img className={panel.iconClass} src={panel.icon}/>
                                    </div>
                                </div>
                                {this.getFoldersPanel(panel)}
                            </div>
                        );
                    })}                                        
                </div>
            </div>
        )
    }

}