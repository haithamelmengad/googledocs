//React and react router imports
import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

//Material UI asset imports
import AppBar from 'material-ui/AppBar';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SearchBar from 'material-ui-search-bar';

//Draft JS imports
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';



export default class User extends React.Component {

  /*
    set intial state
    then call aquireDocuments to gather information from dataBase
  */
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.userId,
      title: '',
      ownedDocuments: [],
      contributedDocuments: [],
      searchedTitle: ''
    }
    console.log(this.state.id);
    console.log(this.props.match.params.userId);
    this.aquireOwnedDocuments();
    this.aquireContributedDocuments();
    console.log('CONTRIBUTED DOCUMENTS:', this.state.contributedDocuments);
  };


  /*
    aquireOwnedDocuments()
    called once inside constructor
    peforms get request
    expected response: { ownedDocs: [...]}
    the array contains all relevant data
  */

  aquireOwnedDocuments() {
    let id = this.state.id
    fetch(`http://localhost:3000/user/${id}`)
    .then(res => res.json())
    .then((res) => {
      this.setState({ownedDocuments: res.ownedDocs})
    })
    .catch((error) => {
      console.log(error);
      alert(error);
    });
  }

  aquireContributedDocuments() {
    let id = this.state.id
    fetch(`http://localhost:3000/contributor-docs/${id}`)
    .then(res => res.json())
    .then((res) => {
      this.setState({ contributedDocuments: res.contributedDocs})
    })
    .catch(error => {
      console.log(error);
      alert(error);
    })
  }


  /*
    handleChange(event)
    called when the new document input is modified
    sets the new state for title
    used in tandem with handleSubmit to manage the form
    at the top of the page, which is a controlled component
  */
  handleChange(event) {
    this.setState({title: event.target.value});
 }

 /*
    handleSubmit(event, history)
    called when user creates new document
    POSTs a request to the sever to create a document
    body of request contains a serialized, empty, editorState
    then redirects back to the user page if document is saved
 */

 handleSubmit(event, history) {
    event.preventDefault();
    let id = this.state.id
    fetch(`http://localhost:3000/user/${id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: event.target.value,
        versions: convertToRaw(EditorState.createEmpty().getCurrentContent()),
      }),
    })
    .then(res => res.json())
    .then((res) => {
      if (res.saved === true) { // EXPECTED RESPONSE: { saved: true }
      window.location.reload();
      }
    })
    .catch((error) => {
      console.log(error);
    });

  }

  /*
    handleOpen(history, docId)
    redirects user to desired document page
  */
  handleOpen(history, docId) {
    history.push(`/document/${docId}`)
  }

  /*
    handleDelete(docId)
    deletes a given document from the database when user
    clicks the delete button
  */

  handleDelete(docId) {
    fetch(`http://localhost:3000/deletedoc/${docId}`)
    .then(res => res.json())
    .then((res) => {
      window.location.reload();
      //get the page to rerender because we dont see the document deleted unless we refresh the page
    })
    .catch(error => {
      console.log(error);
      alert(error);
    })
  }


/*
    handleSearch
    Find document by exact title by posting a request to db
*/
  handleSearch(docInfo) {
    console.log(event.target.value);
    let id = this.state.id;
    fetch(`http://localhost:3000/user/search/${id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: this.state.searchedTitle
      })
    })
    .then(res => res.json())
    .then((res) => {
      this.setState({ownedDocuments : res.ownedDocs})
    })
    .catch(error => {
      console.log(error);
      alert(error);
    })


  }

  /*
    render notes:
    - MuiThemeProvider must be the outmost component or render will crash
    - Second layer must contain render={({ history })} => (...) and remaining
      jsx must go in the parenthesis
    - history must be passed to any function that wishes to use it
    - all cards are created using a map function
  */

  render() {
   return (
     <MuiThemeProvider>
     <Route render={({ history }) => (
     <div>
     <AppBar
      title="Username"
      iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
      <div className="inputContainer" style={style.inputContainer}>
        <form onSubmit={(event) => this.handleSubmit(event, history)}>
          <label>
            <input className="form-control"
              type="text" name="name"
              placeholder="Document Title"
              style={style.inputbox}
              onChange={this.handleChange.bind(this)}
            />
          </label>
          <input
            className="btn btn-secondary"
            type="submit"
            value="Create New"
            style={style.button}
          />
        </form>
        <SearchBar
          value={this.state.searchedTitle}
          onChange={(title) => this.setState({ searchedTitle: title })}
          onRequestSearch={this.handleSearch.bind(this)}
          style={style.search}
        />
      </div>
      <h3> Your Documents </h3>
      {(this.state.ownedDocuments).map((item) =>
        <Card key={item._id}>
          <CardHeader
            title= {item.title}
            // subtitle={item.owner}
          />
          <CardActions>
            <FlatButton label="Open" onClick={() => this.handleOpen(history, item._id)}/>
            <FlatButton label="Delete" onClick={() => this.handleDelete(item._id)} />
          </CardActions>
        </Card>
       )}
       <h3> Shared With You </h3>
       {(this.state.contributedDocuments).map((item) =>
        <Card key={item._id}>
          <CardHeader
            title= {item.title}
            // subtitle={item.owner}
          />
          <CardActions>
            <FlatButton label="Open" onClick={() => this.handleOpen(history, item._id)}/>
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



 const style={
   inputbox: {
     'marginTop': '15px',
     'marginRight': '20px',
     'marginLeft': '10px',
    'padding': '0px',
    'position': 'relative',
    'width': '100%',
    'border': 'none',
    'outline': 'none',
    'backgroundColor': 'white',
    'color': 'rgba(0, 0, 0, 0.87)',
    'cursor': 'auto',
    'fontSize': '16px',
    'lineHeight': '24px',
    'fontFamily': 'Roboto, sans-serif',
    'opacity': '1',
    'height': '100%',
    '-webkit- appearance': 'textfield',
   'height': '48px',
   'boxShadow': 'rgba(0, 0, 0, .12) 0px 1px 6px',
   'paddingLeft': '24px',
   'paddingRight': '24px',
    
   },
   button: {
    "marginLeft": "20px",
    'height': '48px'
   },
   search: {
     'marginRight': '20px',
     'marginTop': '15px',
     'maxWidth': '600px',
   },
   inputContainer: {
    'display': 'flex',
    'justifyContent': 'space-between',
   },
 }
