//react imports
import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

//draft-js imports
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';

//material UI inputs
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
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
import io from 'socket.io-client';


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


export default class Document extends React.Component {
  /*
      constructor()
      sets an initial state for the document
      peforms a get request to the server
      expected response is the unique document data

  */

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      id: props.match.params.docId,
      editorState: EditorState.createEmpty(),
      title: "",
      owner: "",
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
      socket.emit('document-save', { secretToken: this.secretToken, state: convertToRaw(contentState), docId: this.props.match.params.docId, userToken: this.state.owner} )
      return this.setState({ editorState });
    };

    this.handleKeyCommand = this.handleKeyCommand.bind(this);

  }

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
   this.setState({open: true});
  };

  //closes title modal
  handleClose() {
   this.setState({open: false});
  };

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
  _handleChange(event) {
    const target = event.target;
    const value = target.type === 'number' ? EditorState.createWithContent(convertFromRaw(this.state.oldVersions[event.target.value-1])) : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

  }

  componentDidMount() {
    socket.emit('join-document', { docId: this.props.match.params.docId, userToken: 'SOME-USER-TOKEN' }, (ack) => {
      console.log('joined the document');
      if (!ack) console.error('Error joining document!');
      this.secretToken = ack.secretToken;
      this.docId = ack.docId;
      if (ack.state) {
        console.log(ack.state);
        this.setState({
          editorState: EditorState.createWithContent(convertFromRaw(ack.state)),
        });

      }
    });
    socket.on('document-update', (update) => {
      console.log('document updated');
      const { state, docId, userToken } = update;
      if (this.state.author !== userToken) {
        console.log('setting the state');
        this.setState({ editorState: EditorState.createWithContent(convertFromRaw(state)) });
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
          onClick={this.handleClose.bind(this)}
        />,
      ];
    return (
      <MuiThemeProvider>
        <Route render={({ history }) => (
          <div>
            <AppBar
              title={<span style={styleTitle.title}>{this.state.title}: Version {this.state.version}</span>}
              onTitleClick={() => this.handleOpen()}
              iconElementLeft={<IconButton><NavigationClose /></IconButton> }
              iconElementRight={<FlatButton label="Save" onClick={() => this._onSaveClick(history)} />}
              onLeftIconButtonClick={() => this.handleLeftClick(history)}
            />
            <Dialog
              title="Dialog With Actions"
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={() => this.handleClose()}
            >
            <form>
              <label>
                Title:
                <input type="text" name="title" placeholder={this.state.title} onChange={this._handleChange.bind(this, event)}/> <br/ >
              </label>
              <label>
              Version:
              <input type="text" name="editorState" placeholder={this.state.version} onChange={this._handleChange.bind(this, event)}/>
              </label>
            </form>
            </Dialog>
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
              <IconButton><LeftIcon /></IconButton>
              <IconButton><CenterIcon /></IconButton>
              <IconButton><RightIcon /></IconButton>
            </Toolbar>
            <Paper style={stylePaper} zDepth={5}>
              <Editor
                customStyleMap={styleMapEditor}
                editorState={this.state.editorState}
                handleKeyCommand={this.handleKeyCommand}
                onChange={this.onChange.bind(this)}
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
