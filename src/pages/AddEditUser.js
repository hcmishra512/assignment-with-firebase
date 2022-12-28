import React, { useState, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Button, Form, Grid, Loader } from "semantic-ui-react";
import { db, storage } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";
import {
  addDoc,
  doc,
  getDoc,
  updateDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

const AddEditUser = () => {
  const [data, setData] = useState({
    name: "",
    phone: "",
    info: "",
    isWhatsApp: false,
  });
  const { name, phone, info, isWhatsApp } = data;
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    id && getSingleUser();
  }, [id]);

  const getSingleUser = async () => {
    const docRef = doc(db, "users", id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      setData({ ...snapshot.data() });
    }
  };

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;

      console.log(name);
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  // console.log(data);

  const handleChange = (e) => {
    const { value, name, type, checked } = e.target;
    setData({ ...data, [name]: type === "checkbox" ? checked : value });
  };

  const validate = () => {
    let errors = {};
    if (!name) {
      errors.name = "Name is required";
    }
    if (!phone) {
      errors.phone = "Phone is required";
    }
    if ("select" === info) {
      errors.info = "Info is required";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = validate();
    if (Object.keys(errors).length) return setErrors(errors);
    setIsSubmit(true);
    if (!id) {
      try {
        await addDoc(collection(db, "users"), {
          ...data,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await updateDoc(doc(db, "users", id), {
          ...data,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    }

    navigate("/");
  };

  const options = [
    { key: "p", text: "Personal", value: "personal" },
    { key: "o", text: "Official", value: "official" },
  ];

  return (
    <div>
      <Grid
        centered
        verticalAlign="middle"
        columns="3"
        style={{ height: "80vh" }}
      >
        <Grid.Row>
          <Grid.Column textAlign="center">
            <div>
              {isSubmit ? (
                <Loader active inline="centered" seze="huge" />
              ) : (
                <>
                  <h2>{id ? "Update User" : "Add User"}</h2>
                  <Form onSubmit={handleSubmit}>
                    <Form.Input
                      label="Name"
                      error={errors.name ? { content: errors.name } : null}
                      placeholder="Enter Name"
                      name="name"
                      value={name}
                      onChange={handleChange}
                      autoFocus
                    />
                    <Form.Input
                      label="Phone"
                      type="number"
                      error={errors.phone ? { content: errors.phone } : null}
                      placeholder="Enter Phone No."
                      name="phone"
                      value={phone}
                      onChange={handleChange}
                    />

                    <label htmlFor="select">Type of Information : </label>
                    <select
                      type="text"
                      id="info"
                      name="info"
                      onChange={handleChange}
                    >
                      <option value="select"> Select Option</option>
                      <option value="personal">Personal</option>
                      <option value="official">Official</option>
                    </select>

                    <Form.Input
                      label="Is Using WhatsApp"
                      type="checkbox"
                      name="isWhatsApp"
                      value={isWhatsApp}
                      onChange={handleChange}
                    />

                    <Form.Input
                      label="Upload"
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <Button
                      primary
                      type="submit"
                      disabled={progress !== null && progress < 100}
                    >
                      Submit
                    </Button>
                  </Form>
                </>
              )}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default AddEditUser;
