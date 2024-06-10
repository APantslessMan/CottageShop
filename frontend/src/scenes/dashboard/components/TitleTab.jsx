// Added necessary imports
import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import apiService from "../../../components/api/apiService";

// Added functional component declaration
const TitleTab = (props) => {
  // Initialized state
  const [homeData, setHomeData] = useState({
    title: "",
    sub: "",
    img: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Used useEffect to set initial state from props
  useEffect(() => {
    setHomeData({
      title: props.title, // Updated to use individual props
      sub: props.sub, // Updated to use individual props
      img: props.img, // Updated to use individual props
    });
    setImagePreview(props.img); // Updated to use individual props
  }, [props.title, props.sub, props.img]); // Added dependency array to include individual props

  // Handle image change and preview
  //   const handleImageChange = (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //       setImageFile(file);
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setImagePreview(reader.result);
  //       };
  //       reader.readAsDataURL(file);

  //       // Clear the Image URL field
  //       setHomeData((prevData) => ({
  //         ...prevData,
  //         img: "",
  //       }));
  //       reader.readAsDataURL(file);
  //     }
  //   };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setImagePreview(imageUrl);
        setHomeData((prevData) => ({
          ...prevData,
          img: "",
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  // Handle form submission
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("op", "home_hero");
      formData.append("title", homeData.title); // Corrected form data field
      formData.append("sub", homeData.sub); // Corrected form data field
      formData.append("img", homeData.img); // Corrected form data field
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // TODO: Replace with actual API call
      await apiService.editsite(formData);
      console.log(formData.getAll("img"));
    } catch (error) {
      console.error("Error changing setting:", error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2}>
      <Box display="flex" mb={2}>
        <Box flex={1} mr={2}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={homeData.title} // Updated to use homeData state
            onChange={
              (e) => setHomeData({ ...homeData, title: e.target.value }) // Corrected onChange handler
            }
          />
          <TextField
            fullWidth
            label="Subtitle"
            name="sub" // Corrected field name
            value={homeData.sub} // Updated to use homeData state
            onChange={
              (e) => setHomeData({ ...homeData, sub: e.target.value }) // Corrected onChange handler
            }
          />
          <TextField
            fullWidth
            label="Image URL"
            name="img" // Corrected field name
            value={homeData.img} // Updated to use homeData state
            onChange={
              (e) => setHomeData({ ...homeData, img: e.target.value }) // Corrected onChange handler
            }
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </Box>
        <Box flex={1} textAlign="center">
          <Box
            mb={2}
            border={1}
            borderColor="primary.main"
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="250px"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Product"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            ) : (
              <Typography variant="h6">Image Preview</Typography>
            )}
          </Box>
        </Box>
      </Box>
      <Button onClick={handleSubmit} variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
};

export default TitleTab;
