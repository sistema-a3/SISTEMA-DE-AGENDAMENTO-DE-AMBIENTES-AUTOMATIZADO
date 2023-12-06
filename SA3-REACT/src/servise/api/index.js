import axios from "axios"; 

const api = axios.create({
    baseURL: 'http://10.67.23.50:3333'
});

export default api;