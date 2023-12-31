import React, { useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

const ImagesWidget = (props) => {
  const [images, setImages] = useState([]);

  const handleChange = (event) => {
    const files = Array.from(event.target.files);
    Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    ).then(
      (images) => {
        setImages(images); // Update the state with all images as data URLs
        props.onChange(images); // Update the RJSF form data with data URLs instead of Files
      },
      (error) => {
        console.error("Error reading files: ", error);
      }
    );
  };

  return (
    <div>
      <input type="file" onChange={handleChange} accept="image/*" multiple />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Preview ${index}`}
            style={{ maxWidth: "100px" }}
          />
        ))}
      </div>
    </div>
  );
};

const schema = {
  type: "object",
  properties: {
    images: {
      type: "array",
      items: {
        type: "string",
        format: "data-url",
      },
    },
  },
};

const uiSchema = {
  images: {
    "ui:widget": "imagesWidget",
  },
};

const MultiImagesPreview = () => (
  <Form
    validator={validator}
    schema={schema}
    uiSchema={uiSchema}
    widgets={{ imagesWidget: ImagesWidget }}
    onSubmit={({ formData }) => console.log("Data submitted: ", formData)}
  />
);

export default MultiImagesPreview;
