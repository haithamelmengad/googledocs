import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { HashRouter as Router, Route } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';

const docArr = [
  {
    content: 'bunch of random words',
    title: 'document 1'
  },
  {
    content: 'bunch of randomer words',
    title: 'document 2'
  },
  {
    content: 'randomest words',
    title: 'document 3'
  },
  {
    content: 'bunch random words',
    title: 'document 4'
  },
  {
    content: 'bunch of words',
    title: 'document 5'
  },
]



export default class User extends React.Component {

  constructor(props) {
    super(props);
    //initlizes intial state
    this.state = {
      text: '',
      documents: aquireDocuments(),
    }
  };

  aquireDocuments(userID) {
      //returns array of documents associated with user
      return null
  }


  handleOpen(history) {
    console.log(history);
    history.push('/document')
      console.log(history)
  }



  handleToggle() { return this.setState({open: !this.state.open})};

  handleClose()  { return this.setState({open: false})};

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
      <form>
        <label>
          Name:
          <input type="text" name="name" placeholder="Document Title"/>
        </label>
        <input type="submit" value="Create New" />
      </form>
      {docArr.map((item) =>
        <Card>
          <CardHeader
            title= {item.title}
            subtitle={item.content}
          />
          <CardActions>
            <FlatButton label="Open" onClick={() => this.handleOpen(history)}/>
            <FlatButton label="Delete" />
          </CardActions>
        </Card>
       )}
       <h1> Shared with you </h1>
       {docArr.map((item) =>
         <Card>
           <CardHeader
             title= {item.title}
             subtitle={item.content}
           />
           <CardActions>
             <FlatButton label="Open" />
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
