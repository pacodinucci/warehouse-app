export const uploadToCloudinary = async (imageBlob: Blob) => {
  const formData = new FormData();
  formData.append("file", imageBlob);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("Error response from Cloudinary:", error);
    throw new Error("Error uploading to Cloudinary");
  }

  const data = await response.json();
  return data.secure_url;
};
