import axios from "axios";

let baseURL = "http://localhost:8000/";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  baseURL = "http://localhost:8000/";
} else {
baseURL = "https://endpoints.myplebanon.com/";
}

export const base = ()=>{
  return baseURL;
}

export const mediaUrl = `${baseURL}media/`;
const headers = { "Content-Type": "application/json" };

export const parseMedia = name => `${mediaUrl}${name}`;

export const api = axios.create({
  baseURL,
  headers,
  withCredentials: true
});

export const login = ({ username, password }) => {
  return api.post("login", { username, password });
};

export const resetPassword = ({ email }) => {
  return api.post("reset_password", { email });
};

export const logout = () => {
  return api.get("logout");
};

export const postApplication = ({ data }) => {
  return api.post("user_profiles", data);
};

export const getApplications = () => {
  return api.get("user_profiles");
};

export const getApplication = ({ id }) => {
  return api.get(`user_profiles\\${id}`);
};

export const updateApplication = ({ id, data }) => {
  return api.put(`user_profiles\\${id}`, data);
};
export const deleteApplication = ({ id }) => {
  return api.delete(`user_profiles\\${id}`);
};

export const getUsers = () => {
  return api.get("users_profiles");
};

export const postUser = ({ data }) => {
  return api.post("users", data);
};

export const updateUser = ({ id, data }) => {
  return api.put(`users\\${id}`, data);
};

//parties endpoints
export const getParties = () => {
  return api.get("parties");
};

export const getParty = ({ id }) => {
  return api.get(`parties\\${id}`);
};

export const postParty = ({ data }) => {
  return api.post(`parties`, data);
};

export const updateParty = ({ id, data }) => {
  return api.put(`parties\\${id}`, data);
};

export const deleteParty = ({ id }) => {
  return api.delete(`parties\\${id}`);
};

//commitees endpoints
export const getCommitees = () => {
  return api.get("commities");
};

export const getCommity = ({ id }) => {
  return api.get(`commities\\${id}`);
};

export const postCommity = ({ data }) => {
  return api.post(`commities`, data);
};

export const updateCommity = ({ id, data }) => {
  return api.put(`commities\\${id}`, data);
};

export const deleteCommity = ({ id }) => {
  return api.delete(`commities\\${id}`);
};

//commitees endpoints
export const getModerators = () => {
  return api.get("commities");
};

export const getParticipants = () => {
  return api.get(
    "users?role[]=ROLE_PARTICIPANT&userProfile.status=accepted&isPasswordSet=true"
  );
};

export const getAdmins = () => {
  return api.get("users?role[]=ROLE_MODERATOR&role[]=ROLE_COACH");
};

export const getMainUser = ({ id }) => {
  return api.get(`users\\${id}`);
};

export const postMainUser = ({ data }) => {
  return api.post(`users\\register_mod`, data);
};

export const updateMainUser = ({ id, data }) => {
  return api.put(`users\\${id}`, data);
};

export const deleteMainUser = ({ id }) => {
  return api.delete(`users\\${id}`);
};

//images endpoints
export const getImages = () => {
  return api.get("media_objects");
};

export const getImage = ({ id }) => {
  return api.get(`media_objects\\${id}`);
};

export const postImage = ({ data }) => {
  return api.post(`media_objects`, data);
};

export const postFile = ({ data, onUploadProgress }) => {
  return api.post(`media_objects`, data, {
    onUploadProgress: onUploadProgress
  });
};

export const updateImage = ({ id, data }) => {
  return api.put(`media_objects\\${id}`, data);
};

export const deleteImage = ({ id }) => {
  return api.delete(`media_objects\\${id}`);
};

//Special Endpoints
export const checkToken = ({ token }) => {
  return api.get(`check_token\\${token}`);
};

export const confirmApplication = ({ token, password }) => {
  return api.post(`confirm_application`, { token, password });
};

export const getDocuments = () => {
  return api.get(`documents`);
};

export const getGenericDocuments = () => {
  return api.get(`documents?isGeneric=true`);
};

export const getDocument = ({ id }) => {
  return api.get(`documents/${id}`);
};

export const postDocument = ({ data }) => {
  return api.post(`documents`, data);
};

export const updateDocument = ({ id, data }) => {
  return api.put(`documents/${id}`, data);
};

export const deleteDocument = ({ id }) => {
  return api.delete(`documents/${id}`);
};

export const postFullDocument = async ({ data, onUploadProgress }) => {
  const isGeneric = data.isGeneric;
  const resp = await postFile({ data: data.file, onUploadProgress });
  return postDocument({
    data: {
      sender: `/users/${data.sender}`,
      isGeneric,
      file: `/media_objects/${resp.data.id}`
    }
  });
};

export const resendPasswordReminder = ({ id }) => {
  return api.post(`resend_email`, { userId: id });
};

export const postEndorsement = ({ data }) => {
  return api.post(`endorsements`, data);
};

export const getEndorsements = ({ id }) => {
  return api.get(`endorsements?sender.id=${id}`);
};

export const getModsEndorsements = () => {
  return api.get(`endorsements/for_mods`);
};

export const getEndorsementsSheet = () => {
  return api.get('export/endorsements');
}

export const endorsementsSheetBaseUrl = `${baseURL}export/endorsements`;
export const applicationsSheetBaseUrl = `${baseURL}export/applications`;

const lib = (window.api = {
  api,
  postApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
  getUsers,
  postUser,
  updateUser,
  getParties,
  getParty,
  updateParty,
  postParty,
  deleteParty,
  getCommitees,
  getCommity,
  updateCommity,
  postCommity,
  deleteCommity,
  getImages,
  getImage,
  postImage,
  updateImage,
  deleteImage,
  getParticipants,
  postFile,
  checkToken,
  confirmApplication
});

export default lib;
