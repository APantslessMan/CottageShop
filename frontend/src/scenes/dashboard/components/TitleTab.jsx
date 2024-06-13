import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import apiService from "../../../components/api/apiService";

const TitleTab = (props) => {
  const [homeData, setHomeData] = useState({
    title: "",
    sub: "",
    img: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    setHomeData({
      title: props.title,
      sub: props.sub,
      img: props.img,
    });
    setImagePreview(props.img);
  }, [props.title, props.sub, props.img]);

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

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("op", "home_hero");
      formData.append("title", homeData.title);
      formData.append("sub", homeData.sub);
      formData.append("img", homeData.img);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // TODO: Replace with actual API call
      await apiService.editsite(formData);
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
            value={homeData.title}
            onChange={(e) =>
              setHomeData({ ...homeData, title: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Subtitle"
            name="sub"
            value={homeData.sub}
            onChange={(e) => setHomeData({ ...homeData, sub: e.target.value })}
          />
          <TextField
            fullWidth
            label="Image URL"
            name="img"
            value={homeData.img}
            onChange={(e) => setHomeData({ ...homeData, img: e.target.value })}
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
