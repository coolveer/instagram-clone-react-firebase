import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post.js";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from 'react-instagram-embed';
import SendIcon from '@material-ui/icons/Send';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [post, setPost] = useState([]);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openLogin, setOpenLogin] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    db.collection("post")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPost(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
      });
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  const signup = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((err) => alert(err.message));
    setEmail("");
    setPassword("");
    setOpen(false);
  };

  const signin = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch(
      (err) => {
        alert(err.message)
      }
    );
    setEmail("");
    setPassword("");
    setOpenLogin(false);
  };

  const messenger = () => {
    window.location.replace("https://facebook-messenger-clone-34433.web.app/")
  }

  return (
    <div className="App">
      {/* signup model */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              className="app__headderImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="instagram logo "
            />
          </center>
          <form className="app__form">
            <Input
              type="text"
              placeholder="User Name"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <Input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Button type="submit" onClick={signup}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>
      {/* login model  */}
      <Modal open={openLogin} onClose={() => setOpenLogin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              className="app__headderImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="instagram logo "
            />
          </center>
          <form className="app__form">
            <Input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Button type="submit" onClick={signin}>
              Login
            </Button>
          </form>
        </div>
      </Modal>
      {/* end of model  */}
      <div className="app__headder">
        <img
          className="app__headderImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="instagram logo "
        />
        {!user ? (
          <div>
            <Button type="button" onClick={() => setOpenLogin(true)}>
              login
            </Button>
            <Button type="button" onClick={handleOpen}>
              signup
            </Button>
          </div>
        ) : (
          <div>
          <Button type="button" onClick={() => auth.signOut()}>
            Logout
          </Button>
          <Button type="button" onClick={messenger}>
          <SendIcon />
        </Button>
        </div>
        )}
      </div>

      <div className="app__posts">
        <div className="app__postsleft">
        <InstagramEmbed
            url="https://www.instagram.com/p/B-fer9EnBi0/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
          {post.map(({ id, post }) => (
            <Post
              key={id}
              postId = {id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
      </div>
      <div className="app__addpost">
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )}
      </div>
      
    </div>
  );
}

export default App;
