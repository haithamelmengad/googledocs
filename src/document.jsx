import React from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
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
import { HashRouter as Router, Route } from 'react-router-dom';


const style = {
  height: 600,
  width: 400,
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: 60,
  padding: 20,
};

const styleMap =
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

const styles = {
  title: {
    cursor: 'pointer',
  },
};

export default class Document extends React.Component {

  constructor(props) {
    super(props);

    console.log(props.match.params.docId)
    // WE ALSO MIGHT WANT THE ID IN THE STATE
    this.state = {
      editorState: EditorState.createEmpty(),
      title: "",
      owner: "",
    };


    const id = '5ab2ecde40e9dc0e58a378a1'

    fetch(`http://localhost:3000/document/${id}`)
    .then(res => res.json())
    .then((res) => {
      res.versions.entityMap = res.versions.entityMap || {}
      this.setState({
        editorState: EditorState.createWithContent(convertFromRaw(res.versions)),
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
      saveContent(contentState);
      return this.setState({ editorState });
    };

    this.handleKeyCommand = this.handleKeyCommand.bind(this);

    const saveContent = (content) => {
     console.log(content)
    };
  }


  // boiler plate
  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

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

  handleTitleClick(history) {
    history.push(`/user/${this.state.owner}`);
  }


  render() {
    return (
      <MuiThemeProvider>
        <Route render={({ history }) => (
          <div>
            <AppBar
              title={<span style={styles.title}>{this.state.title}</span>}
              onTitleClick={() => this.handleTitleClick(history)}
              iconElementLeft={<IconButton><NavigationClose /></IconButton>}
              iconElementRight={<FlatButton label="Save" onClick={() => this.handleSaveClick(history)} />}
            />
            <Toolbar>
              <IconButton onClick={() => this._onBoldClick}><BoldIcon /></IconButton>
              <IconButton onClick={() => this._onItalicsClick}><ItalicIcon /></IconButton>
              <IconButton onClick={() => this._onUnderlineClick}><UnderlineIcon /></IconButton>
              <IconButton onClick={() => this._onStrikeClick}><StrikethroughIcon /></IconButton>
              <IconButton onClick={() => this.toggleBulletPoints}><BulletedListIcon /></IconButton>
              <IconButton onClick={() => this.toggleOrderedList}><NumberedListIcon /></IconButton>
              <IconMenu
                iconButtonElement={<IconButton><PaintIcon /></IconButton>}
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              >
                <MenuItem primaryText="Blue" onClick={() => this._onBlueClick} />
                <MenuItem primaryText="Red" onClick={() => this._onRedClick} />
                <MenuItem primaryText="Yellow" onClick={() => this._onYellowClick} />
                <MenuItem primaryText="Green" onClick={() => this._onGreenClick} />
                <MenuItem primaryText="Black" />
              </IconMenu>
              <IconMenu
                iconButtonElement={<IconButton><ColorFillIcon /></IconButton>}
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              >
                <MenuItem primaryText="Blue" onClick={() => this._onBlueBackClick} />
                <MenuItem primaryText="Red" onClick={() => this._onRedBackClick} />
                <MenuItem primaryText="Yellow" onClick={() => this._onYellowBackClick} />
                <MenuItem primaryText="Green" onClick={() => this._onGreenBackClick} />
                <MenuItem primaryText="Black" />
              </IconMenu>
              <IconButton onClick={() => this.toggleOrderedList}><LeftIcon /></IconButton>
              <IconButton onClick={() => this.toggleOrderedList}><CenterIcon /></IconButton>
              <IconButton onClick={() => this.toggleOrderedList}><RightIcon /></IconButton>
            </Toolbar>
            <Paper style={style} zDepth={5}>
              <Editor
                customStyleMap={styleMap}
                editorState={this.state.editorState}
                handleKeyCommand={this.handleKeyCommand}
                onChange={this.onChange}
              />
            </Paper>
          </div>
   )}
        />
      </MuiThemeProvider>
    );
  }
 }
