import axios from "axios";

export default axios.create({
  baseURL: "http://10.0.2.2:8000/api/",
  // baseURL: "https://seal-app-ffik9.ondigitalocean.app/api/",
});
