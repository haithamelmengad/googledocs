//react imports
import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { withRouter } from 'react-router';
//draft-js imports
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import createStyles from 'draft-js-custom-styles';


//material UI inputs
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import UnderlineIcon from 'material-ui/svg-icons/editor/format-underlined';
import ColorFillIcon from 'material-ui/svg-icons/editor/format-color-fill';
import BulletedListIcon from 'material-ui/svg-icons/editor/format-list-bulleted';
import NumberedListIcon from 'material-ui/svg-icons/editor/format-list-numbered';
import StrikethroughIcon from 'material-ui/svg-icons/editor/strikethrough-s';
import BoldIcon from 'material-ui/svg-icons/editor/format-bold';
import ItalicIcon from 'material-ui/svg-icons/editor/format-italic';
import PaintIcon from 'material-ui/svg-icons/editor/format-paint';
import LeftIcon from 'material-ui/svg-icons/editor/format-align-left';
import CenterIcon from 'material-ui/svg-icons/editor/format-align-center';
import RightIcon from 'material-ui/svg-icons/editor/format-align-right';
import AppBar from 'material-ui/AppBar';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import FormatSize from 'material-ui/svg-icons/editor/format-size';
import PersonAdd from 'material-ui/svg-icons/social/person-add';


//Socket import
import io from 'socket.io-client';
import currentUser from './currentUser';

const socket = io('http://localhost:3000')
socket.on('connect', function(){console.log('ws connect')})
socket.on('disconnect', function(){console.log('ws disconnect')})

//Style Object for paper
//centers and widens
const stylePaper = {
  height: 600,
  width: 400,
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: 60,
  padding: 20,
};

//customStyleMap for editor
const styleMapEditor =
  {
    STRIKETHROUGH: {
      textDecoration: 'line-through',
    },
    BLUE: {
      color: 'blue',
    },
    GREEN: {
      color: 'green',
    },
    YELLOW: {
      color: 'yellow',
    },
    RED: {
      color: 'red',
    },
    BLACK: {
      color: 'black',
    },
    BLUEBACK: {
      backgroundColor: 'blue',
    },
    GREENBACK: {
      backgroundColor: 'green',
    },
    YELLOWBACK: {
      backgroundColor: 'yellow',
    },
    REDBACK: {
      backgroundColor: 'red',
    },
    BLACKBACK: {
      backgroundColor: 'black',
    },
  };

//style object for title
//give title a 'pointer' when hovered over
const styleTitle = {
  title: {
    cursor: 'pointer',
  },
};

const customStyleMap = {
 MARK: {
   backgroundColor: 'Yellow',
   fontStyle: 'italic',
 },
};

const { styles, customStyleFn, exporter } = createStyles(['font-size', 'color'], 'PREFIX', customStyleMap);

function getBlockStyle(block) {
  const type = block.getType()
  if(type.indexOf('text-align-') === 0) return type
  return null
}

class Document extends React.Component {
  /*
    constructor()
    sets an initial state for the document
    peforms a get request to the server
    expected response is the unique document data

  */

  constructor(props) {
    super(props);
    this.state = {
      modal1Open: false,
      modal2Open: false,
      drawerOpen: false,
      id: props.match.params.docId,
      editorState: EditorState.createEmpty(),
      title: "",
      owner: "",
      contributors: [],
      currentUser: currentUser,
    };

    fetch(`http://localhost:3000/document/${this.state.id}`)
    .then(res => res.json())
    .then((res) => {
      res.versions[res.versions.length-1].entityMap = res.versions.entityMap || {}
      this.setState({
        version: res.versions.length,
        oldVersions: res.versions,
        editorState: EditorState.createWithContent(convertFromRaw(res.versions[res.versions.length-1])),
        title: res.title,
        owner: res.owner,
      })
      })
    .catch((error) => {
      console.log(error);
      alert(error);
    });

    this.onChange = (editorState) => {
      const contentState = editorState.getCurrentContent();
      socket.emit('document-save', { secretToken: this.secretToken, state: convertToRaw(contentState), docId: this.props.match.params.docId, userToken: currentUser.user._id});
      this.setState({ editorState });
    };
    this.handleKeyCommand = this.handleKeyCommand.bind(this);


  }

  toggleFontSize(fontSize) {
    const newEditorState = styles.fontSize.toggle(this.state.editorState, fontSize);
    return this.onChange(newEditorState);
  };

  addAlign(tag) {
    return this.onChange(RichUtils.toggleBlockType(this.state.editorState, tag))
  };

  // boiler plate
  // needed for editor to function
  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }


  /*
    _onSaveClick()
    called when the user saves the document
    sends the serialized content and current title to the database to persist
    when the document is confirmed saved the page reloads with the new version
  */
  _onSaveClick() {
    fetch(`http://localhost:3000/document/version/${this.state.id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: convertToRaw(this.state.editorState.getCurrentContent()),
        title: this.state.title
      }),
    })
    .then(res => res.json())
    .then((res) => {
      window.location.reload();
      })
    .catch((error) => {
      console.log(error);
    });
  }

  //opens title modal
  handleOpen() {
   this.setState({modal1Open: true});
  };

  //closes title modal
  handleClose() {
   this.setState({modal1Open: false});
  };

  handleOpenModal2() {
   this.setState({modal2Open: true});
  };

  //closes title modal
  handleCloseModal2() {
   this.setState({modal2Open: false});
  };


  handleSubmitModal2() {
    fetch(`http://localhost:3000/addContributor/${this.state.id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contributor: this.state.tempContributor,
        }),
      })
      .then(res => res.json())
      .then((res) => {
        if (res.contributorAdded) { 
        // only add contributors that don't already exist
        let newContributors = [...this.state.contributors]
        if(!newContributors.includes(res.contributorAdded)){
          newContributors.push(res.contributorAdded)
        }
        this.setState({
          modal2Open: false,
          contributors: newContributors,
        });
        } else {
          console.log(res.error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
   };

  _handleToggle() {
    this.setState({drawerOpen: !this.state.open});
  }

  _handleClose() {
    this.setState({drawerOpen: false});
  }

  changeVersion(version) {
    this.state.oldVersions[version].entityMap = this.state.oldVersions[version].entityMap || {}
    this.setState({
      editorState: EditorState.createWithContent(convertFromRaw(this.state.oldVersions[version])),
      version: version+1,
      drawerOpen: false
     })
  }


  //returns the user to their document overview page
  handleLeftClick(history) {
    history.push(`/user/${this.state.owner}`);
  }

  /*
    _handleChange(event)
    handles the title and version changes
    currently can only change title
    title changes only persist after saving
    Version change functionality doesn't work
  */

 _handleChangeModal2(event) {
  this.setState({
    tempContributor: event.target.value
  });
}

  _handleChange(event) {
    this.setState({
      title: event.target.value
    });

  }


  componentDidMount() {
    if (!currentUser.token) {
      const savedCurrentUser = window.localStorage.getItem('currentUser');
      if (savedCurrentUser) {
        Object.assign(currentUser, JSON.parse(savedCurrentUser));
      } else {
        this.props.history.push('/');
        return;
      }
    }
    this.setState({
      currentUser: currentUser,
    })
    socket.emit('join-document', { docId: this.props.match.params.docId, userToken: currentUser.user._id }, (ack) => {
      if (!ack) console.error('Error joining document!');
      this.secretToken = ack.secretToken;
      this.docId = ack.docId;
      if (ack.state) {
        this.setState({
          editorState: EditorState.createWithContent(convertFromRaw(ack.state)),
        });
      }
    });
    socket.on('document-update', (update) => {
      const { state, docId, userToken } = update;
      if (currentUser.user._id !== userToken) {
        this.setState({editorState: EditorState.createWithContent(convertFromRaw(state))});
      }
    });
  }

  /*
      Render NOTES:
    - actions array is passed to the dialog(modal) element
    - MuiThemeProvider must be the outmost component or render will crash
    - Second layer must contain render={({ history })} => (...) and remaining
      jsx must go in the parenthesis
    - history must be passed to any function that wishes to use it
    -
  */
  render() {
    let actions = [
        <FlatButton
          label="Cancel"
          primary={true}
          onClick={this.handleClose.bind(this)}
        />,
        <FlatButton
          label="Submit"
          primary={true}
          keyboardFocused={true}
          onClick={
            this.handleClose.bind(this)}
        />,
      ];

    let actions2 = [
        <FlatButton
          label="Cancel"
          primary={true}
          onClick={this.handleCloseModal2.bind(this)}
        />,
        <FlatButton
          label="Submit"
          primary={true}
          keyboardFocused={true}
          onClick={this.handleSubmitModal2.bind(this)}
        />,
      ];
    return (
      <MuiThemeProvider>
        <Route render={({ history }) => (
          <div>
            <AppBar
              title={<span style={styleTitle.title}>{this.state.title}</span>}
              onTitleClick={() => this.handleOpen()}
              iconElementLeft={<IconButton><NavigationClose /></IconButton> }
              iconElementRight={<FlatButton label="Save" onClick={() => this._onSaveClick(history)} />}
              onLeftIconButtonClick={() => this.handleLeftClick(history)}
            />
            <AppBar
              title={<span style={styleTitle.title}> Version {this.state.version}</span>}
              iconElementRight={<IconButton value={this.state.contributors}><PersonAdd /></IconButton> }
              onLeftIconButtonClick={this._handleToggle.bind(this) }
              onRightIconButtonClick={() => this.handleOpenModal2()}
            />
            <Dialog
              title="Add collaborator"
              actions={actions2}
              modal={false}
              open={this.state.modal2Open}
              onRequestClose={() => this.handleCloseModal2()}
            >
            <form>
              <label>
                Collaborator:
                <input type="text" name="collaborator" placeholder="Add collaborator" onChange={this._handleChangeModal2.bind(this)}/> <br/ >
              </label>
            </form>
            </Dialog>
            <Dialog
              title="Change Title"
              actions={actions}
              modal={false}
              open={this.state.modal1Open}
              onRequestClose={() => this.handleClose()}
            >
            <form>
              <label>
                Title:
                <input type="text" name="title" placeholder={this.state.title} onChange={this._handleChange.bind(this)}/> <br/ >
              </label>
            </form>
            </Dialog>
            <Drawer
              docked={false}
              width={200}
              open={this.state.drawerOpen}
              onRequestChange={(open) => this.setState({drawerOpen:open})}
            >
            <h1>Versions:</h1>
            {this.state.oldVersions && this.state.oldVersions.map((item, index) =>
              <MenuItem key={index} onClick={() => this.changeVersion(index)}>version: {index+1}</MenuItem>
            )}
            </Drawer>
            <Toolbar>
              <IconButton onClick={() => this._onBoldClick()}><BoldIcon /></IconButton>
              <IconButton onClick={() => this._onItalicsClick()}><ItalicIcon /></IconButton>
              <IconButton onClick={() => this._onUnderlineClick()}><UnderlineIcon /></IconButton>
              <IconButton onClick={() => this._onStrikeClick()}><StrikethroughIcon /></IconButton>
              <IconButton onClick={() => this.toggleBulletPoints()}><BulletedListIcon /></IconButton>
              <IconButton onClick={() => this.toggleOrderedList()}><NumberedListIcon /></IconButton>
              <IconMenu
                iconButtonElement={<IconButton><PaintIcon /></IconButton>}
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              >
                <MenuItem primaryText="Blue" onClick={() => this._onBlueClick()} />
                <MenuItem primaryText="Red" onClick={() => this._onRedClick()} />
                <MenuItem primaryText="Yellow" onClick={() => this._onYellowClick()} />
                <MenuItem primaryText="Green" onClick={() => this._onGreenClick()} />
                <MenuItem primaryText="Black" />
              </IconMenu>
              <IconMenu
                iconButtonElement={<IconButton><ColorFillIcon /></IconButton>}
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              >
                <MenuItem primaryText="Blue" onClick={() => this._onBlueBackClick()} />
                <MenuItem primaryText="Red" onClick={() => this._onRedBackClick()} />
                <MenuItem primaryText="Yellow" onClick={() => this._onYellowBackClick()} />
                <MenuItem primaryText="Green" onClick={() => this._onGreenBackClick()} />
                <MenuItem primaryText="Black" />
              </IconMenu>
              <IconButton onClick={() => this.toggleFontSize('36px')}><FormatSize /></IconButton>
              <IconButton onClick={() => this.addAlign('text-align-left')}><LeftIcon /></IconButton>
              <IconButton onClick={() => this.addAlign('text-align-center')} ><CenterIcon /></IconButton>
              <IconButton onClick={() => this.addAlign('text-align-right')}><RightIcon /></IconButton>
            </Toolbar>
            <Paper style={stylePaper} zDepth={5}>
              <Editor
                customStyleFn={customStyleFn}
                blockStyleFn={getBlockStyle}
                customStyleMap={customStyleMap}
                editorState={this.state.editorState}
                handleKeyCommand={this.handleKeyCommand}
                // onChange={this.onChange.bind(this)}
                onChange={(editorState) => this.onChange(editorState)}
              />
            </Paper>
          </div>
   )}
        />
      </MuiThemeProvider>
    );
  }



  /*
    STYLE FUNCTIONS
    Each function is called to format the selection in the editor.
    The color functions could be refactored but the BOLD ITALIC and others will
    likely need to stay
  */

  // changes font to BOLD
  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  // changes font to ITALICS
  _onItalicsClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }

  // changes font to UNDERLINED
  _onUnderlineClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  }

  _onStrikeClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'STRIKETHROUGH'));
  }

  _onBlueClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BLUE'));
  }

  _onBlueBackClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BLUEBACK'));
  }

  _onRedClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'RED'));
  }

  _onGreenClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'GREEN'));
  }

  _onYellowClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'YELLOW'));
  }

  _onRedBackClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'REDBACK'));
  }

  _onGreenBackClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'GREENBACK'));
  }

  _onYellowBackClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'YELLOWBACK'));
  }

  toggleBulletPoints() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'unordered-list-item'));
  }

  toggleOrderedList() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'ordered-list-item'));
  }

 }

 export default withRouter(Document);
