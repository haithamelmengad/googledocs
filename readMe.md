# GoogleDocs

This is an electron based collaborative rich text editor. Stores users, versions, and allows users to collaborate in real time.

## Getting going

Download or clone this repo and begin with an NPM install


```
$ npm install
```


Create a env.sh file to connect you to your database.

```
export MONGODB_URI="<some_url>"
export SECRET="<SOME_SECRET>"
export JWT_SECRET="<OTHER_SECRET>"
```

Source this file in your terminal, then you'll need to run 2 other commands.

```
$ npm start
```
```
$ npm run backend-dev
```

## Built With

* [electronjs](https://electronjs.org/) - The desktop application framework used
* [react](https://reactjs.org/) - Used to build the UI
* [react-router](https://reacttraining.com/react-router/) - Brings react components together
* [material-ui](https://www.material-ui.com) - React component library
* [draft-js](https://draftjs.org/docs/overview.html#content) - Rich text editor for JS
* [passportjs](http://www.passportjs.org/) - User authentication
* [socket.io](https://socket.io/) - Used to implement websockets
* [express-js](http://expressjs.com/) - Used to architect the API for the project
* [mongoose](http://mongoosejs.com/) - Used to communicate with MLAB


## Authors

* **Delaney Ugelstad** - [dugelsta](https://github.com/dugelsta/)
* **Haitham El Mengad** - [haithamelmengad](https://github.com/haithamelmengad/)
* **Salmaan Rashiq** - [salmaanrashiq](https://github.com/salmaanrashiq/)
