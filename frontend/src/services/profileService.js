import api from "./api";

/*
|--------------------------------------------------------------------------
| Get Profile
|--------------------------------------------------------------------------
*/

export const getProfile = () => {
  return api.get("/profile");
};

/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

export const updateProfile = async (data) => {
  const formData = new FormData();

  formData.append("name", data.name);

  if (data.resume instanceof File) {
    formData.append("resume", data.resume);
  }

  if (data.profileImage) {
    formData.append(
      "profileImage",
      data.profileImage
    );
  }

  const res = await api.put(
    "/profile",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res;
};

/*
|--------------------------------------------------------------------------
| Upload Profile Image
|--------------------------------------------------------------------------
*/

export const uploadProfileImage = async (
  image
) => {
  const formData = new FormData();

  formData.append("image", image);

  const res = await api.post(
    "/profile/upload-image",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res;
};