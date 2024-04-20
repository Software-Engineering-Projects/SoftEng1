import axios from "axios";

export const baseURL =
  import.meta.env.VITE_BASE_URL;

export const getUserCount = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/users/count`);
    console.log(res.data.count);
    return res.data.count;
  } catch (err) {
    return null;
  }
};

export const getUserList = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/users/list`);
    return res.data.data;
  } catch (err) {
    return null;
  }
};

export const getUserRole = async (userId) => {
  try {
    const res = await axios.get(`${baseURL}/api/users/role/${userId}`);
    return res.data.role;
  } catch (err) {
    return null;
  }
}

export const getUserById = async (userId) => {
  try {
    const res = await axios.get(`${baseURL}/api/users/${userId}`);
    return res.data.data;
  } catch (err) {
    return null;
  }
}

export const deleteUserById = async (userId) => {
  try {
    const res = await axios.delete(`${baseURL}/api/users/${userId}`);
    return res.data;
  } catch (err) {
    return null;
  }
}
