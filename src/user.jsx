import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { HashRouter as Router, Route } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';



export default class User extends React.Component {

  constructor(props) {
    super(props);
    //initlizes intial state

    this.state = {
      id: props.match.params.userId,
      title: '',
      documents: [],
    }
    this.aquireDocuments()
  };


  aquireDocuments() {
    let id = this.state.id
    fetch(`http://localhost:3000/user/${id}`)
    .then(res => res.json())
    .then((res) => {
      this.setState({documents: res.ownedDocs})
      return res
    })
    .catch((error) => {
      console.log(error);
      alert(error);
    });
  }

  handleChange(event) {
    console.log(this.state.title)
    this.setState({title: event.target.value});
 }


 handleSubmit(event, history) {
    event.preventDefault();
    console.log(EditorState.createEmpty().getCurrentContent())
    console.log(convertToRaw(EditorState.createEmpty().getCurrentContent()))
    console.log(JSON.stringify(convertToRaw(EditorState.createEmpty().getCurrentContent())))
    let id = this.state.id
    fetch(`http://localhost:3000/user/${id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: this.state.title,
        versions: convertToRaw(EditorState.createEmpty().getCurrentContent()),
      }),
    })
    .then(res => res.json())
    .then((res) => {
      console.log(res)
      if (res.saved === true) { // EXPECTED RESPONSE: { saved: true }
        history.push(`/user/${id}`);
      }
    })
    .catch((error) => {
      console.log(error);
      alert("hello" + error);
    });

  }


  handleOpen(history, docId) {
    history.push(`/document/${docId}`)
  }


  render() {
   return (
     <MuiThemeProvider>
     <Route render={({ history }) => (
     <div>
     <AppBar
      title="Username"
      iconClassNameRight="muidocs-icon-navigation-expand-more"
      onTitleClick={() => alert('fuck')}
      />
      <h1> Your Documents </h1>
      <form onSubmit={(event) => this.handleSubmit(event, history)}>
        <label>
          Name:
          <input type="text" name="name" placeholder="Document Title" onChange={this.handleChange.bind(this)}/>
        </label>
        <input type="submit" value="Create New"  />
      </form>
      {(this.state.documents).map((item) =>
        <Card>
          <CardHeader
            title= {item.title}
            subtitle={item.owner}
          />
          <CardActions>
            <FlatButton label="Open" onClick={() => this.handleOpen(history, item.id)}/>
            <FlatButton label="Delete" />
          </CardActions>
        </Card>
       )}
     </div>
   )}
   />
 </MuiThemeProvider>
);
 }

 }
