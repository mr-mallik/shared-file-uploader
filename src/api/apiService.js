import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';
const API_TOKEN = process.env.REACT_APP_API_TOKEN;

const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_TOKEN}`
  },
});

export const uploadFile = async (formData) => {
  try {
    const response = await apiService.post(`/upload.php`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${API_TOKEN}`
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error uploading file');
  }
};

export const getFiles = async () => {
  try {
    const response = await apiService.get(`/media.php`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching files');
  }
};