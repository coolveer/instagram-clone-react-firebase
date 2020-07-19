import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import * as firebase from "firebase/app";
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import ChatBubbleOutlineOutlinedIcon from '@material-ui/icons/ChatBubbleOutlineOutlined';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';
import BookmarksOutlinedIcon from '@material-ui/icons/BookmarksOutlined';

function Post({ username, caption, imageUrl, postId,user }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("post")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp','desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("post").doc(postId).collection("comments").add({
      text:comment,
      username:user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    setComment('');
  };

  return (
    <div className="post">
      <div className="post__headder">
        <Avatar alt={username} src="/static/images/avatar/1.jpg" />
        <h3 className="post__usename">{username}</h3>
      </div>
      <img className="post__image" src={imageUrl} alt="post image " />
      <h4 className="post__caption">
        <div className="post__iconContainer">
        <div className="post__icons">
          <FavoriteBorderOutlinedIcon className="post__padding"/>
          <ChatBubbleOutlineOutlinedIcon  className="post__padding"/>
          <ShareOutlinedIcon  className="post__padding"/>

        </div>
        <div>
          <BookmarksOutlinedIcon/>
        </div>
        </div>
        
        <strong>{username}</strong> {caption}
      </h4>
      <div className="post__comments">
        {comments.map((comment) => 
          (<p>
            <strong> {comment.username} </strong> {comment.text}
          </p>)
        )}
      </div>
      {user && (
        <form className="post__commentBox">
        <input
          type="text"
          className="post__input"
          placeholder="write comment here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="post__button"
          disabled={!comment}
          type="submit"
          onClick={postComment}
        >
          post
        </button>
      </form>
      )}
      
    </div>
  );
}

export default Post;
