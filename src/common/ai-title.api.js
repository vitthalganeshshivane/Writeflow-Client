import axios from "axios";

export const requestTitleAgent = (payload, accessToken) => {
  return axios.post(
    import.meta.env.VITE_SERVER_DOMAIN + "/agent/title",
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};
