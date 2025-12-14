import axios from "axios";

const authAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // For httpOnly cookies
});

// authAxios.interceptors.request.use(
//   (config) => {
//     // Get token from localStorage (if using localStorage instead of httpOnly)
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // Optional: Add timestamp for debugging
//     config.metadata = { startTime: new Date() };

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// authAxios.interceptors.response.use(
//   (response) => {
//     // Optional: Log response time
//     if (response.config.metadata?.startTime) {
//       const endTime = new Date();
//       const duration = endTime - response.config.metadata.startTime;
//       console.log(`✅ ${response.config.url} - ${duration}ms`);
//     }

//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     // Log error
//     console.error("❌ API Error:", {
//       url: error.config?.url,
//       status: error.response?.status,
//       message: error.response?.data?.message || error.message,
//     });

//     // Handle 401 Unauthorized (token expired)
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // If using refresh tokens, implement refresh logic here
//         // const newToken = await refreshToken();
//         // localStorage.setItem('token', newToken);
//         // originalRequest.headers.Authorization = `Bearer ${newToken}`;
//         // return authAxios(originalRequest);

//         // For httpOnly cookies, just redirect to login
//         if (window.location.pathname !== "/login") {
//           window.location.href = "/login";
//         }
//       } catch (refreshError) {
//         // Clear token and redirect
//         localStorage.removeItem("token");
//         window.location.href = "/login";
//       }
//     }

//     // Handle 403 Forbidden
//     if (error.response?.status === 403) {
//       // Redirect to unauthorized page or show message
//       console.error("Access forbidden");
//     }

//     // Handle network errors
//     if (!error.response) {
//       console.error("Network error - check internet connection");
//     }

//     return Promise.reject(error);
//   }
// );

export default authAxios;
