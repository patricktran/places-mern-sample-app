import React, { useRef, useState, useEffect } from 'react';
import Button from './button';
import './image-upload.scss';

const ImageUpload = (props) => {
  const filePickerRef = useRef();
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!file) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const openPickImageHandler = () => {
    //open up file picker
    filePickerRef.current.click();
  };

  const pickedImageHandler = (e) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (e.target.files && e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }

    //** passing in `isValid` won't work because the state change is queued and asynchronous */
    //props.onInput(props.id, pickedFile, isValid);

    props.onInput(props.id, pickedFile, fileIsValid); //use fileIsValid variable to hold latest value
  };

  return (
    <div className="form-control">
      <input
        ref={filePickerRef}
        type="file"
        id={props.id}
        style={{ display: 'none' }}
        accept=".jpg,.png,.jpeg"
        onChange={pickedImageHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={openPickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
