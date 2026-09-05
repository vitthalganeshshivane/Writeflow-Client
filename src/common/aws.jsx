import axios from "axios";

export const uploadImage = async (img, access_token) => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_SERVER_DOMAIN}/upload/get-upload-url`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    await axios.put(data.uploadURL, img, {
      headers: { "Content-Type": img.type },
    });

    return data.uploadURL.split("?")[0];
  } catch (error) {
    console.error("Image upload failed:", error);
    return null;
  }
};
