# GoogleDocs

This is an electron based collaborative rich text editor. Stores users, versions, and allows users to collaborate in real time.

## Getting going

Download or clone this repo and begin with an NPM install


```
$ npm install
```


Create a env.sh file to connect you to your database

```
export MONGODB_URI="some_url"
export SECRET="SOME_SECRET"
export JWT_SECRET="someothersecret"
```

Source this file in your terminal, then you'll need to run 2 other commands.

```
$ npm start
```
```
$ npm run back end dev
```

## Built With

* [electronjs](https://electronjs.org/) - The desktop application framework used
* [react](https://reactjs.org/) - Dependency Management
* [react-router](https://reacttraining.com/react-router/) - Dependency Management
* [material-ui](https://www.material-ui.com) - Used to generate RSS Feeds
* [draft-js](https://draftjs.org/docs/overview.html#content) - Used to generate RSS Feeds
* [passportjs](http://www.passportjs.org/) - Used to generate RSS Feeds
* [socket.io](https://socket.io/) - Used to generate RSS Feeds
* [express-js](http://expressjs.com/) - Used to generate RSS Feeds


## Authors

* **Delaney Ugelstad** - [dugelsta](https://github.com/PurpleBooth)
* **Haitham El Mengad** - [haithamelmengad](https://github.com/PurpleBooth)
* **Salmaan Rashiq** - [salmaanrashiq](https://github.com/PurpleBooth)
