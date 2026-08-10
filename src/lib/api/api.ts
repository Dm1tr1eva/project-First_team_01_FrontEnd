// import axios from "axios";

// const api = axios.create({
//   baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
//   withCredentials: true,
// });

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.BACKEND_API_URL}/api`,
});

export default api;
