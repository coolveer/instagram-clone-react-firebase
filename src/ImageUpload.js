import React, { useState } from "react";
import { Button, Input } from "@material-ui/core";
import { db, storage } from "./firebase";
import * as firebase from "firebase/app";
import "./ImageUpload.css";

function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);

  const handelChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]); console.log(image)
    }
  };

  const handelUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes)*100
        );
        setProgress(progress);
      },
      (err) => {
        console.log(err);
        alert(err);
      },
      () => {
        // complete function
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            // post the image db
            db.collection("post").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username:username
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageupload" >
      <progress value={progress} max="100" />
      <Input
        type="text"
        placeholder="Write a caption here..."
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
      />
      <Input type="file" onChange={handelChange} />
      <Button onClick={handelUpload}>Upload</Button>
    </div>
  );
}

export default ImageUpload;
