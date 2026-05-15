import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { Toaster } from "react-hot-toast";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/editor.pages";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import ProfilePage from "./pages/profile.page";
import BlogPage from "./pages/blog.page";
import SideNav from "./components/sidenavbar.component";
import ChangePassword from "./pages/change-password.page";
import EditProfile from "./pages/edit-profile.page";
import Notifications from "./pages/notifications.page";
import ManageBlogs from "./pages/manage-blogs.page";

export const userContext = createContext({});
export const ThemeContext = createContext({});
export const AIModelContext = createContext({});

const getInitialAIModel = () => {
  if (typeof window === "undefined") return "groq";
  return localStorage.getItem("ai_model") || "groq";
};

const App = () => {
  const [userAuth, setUserAuth] = useState({ access_token: null });
  const [theme, setTheme] = useState("light");
  const [aiModel, setAiModel] = useState(getInitialAIModel);

  useEffect(() => {
    const userInSession = lookInSession("user");
    const themeInSession = lookInSession("theme");

    if (userInSession) {
      setUserAuth(JSON.parse(userInSession));
    } else {
      setUserAuth({ access_token: null });
    }

    const resolvedTheme =
      themeInSession ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    setTheme(resolvedTheme);
    document.body.setAttribute("data-theme", resolvedTheme);
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("ai_model", aiModel);
  }, [aiModel]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <AIModelContext.Provider value={{ aiModel, setAiModel }}>
        <userContext.Provider value={{ userAuth, setUserAuth }}>
          <Toaster position="top-center" reverseOrder={false} />
          <Routes>
            <Route path="/editor" element={<Editor />} />
            <Route path="/editor/:blog_id" element={<Editor />} />
            <Route path="/" element={<Navbar />}>
              <Route index element={<HomePage />} />
              <Route path="dashboard" element={<SideNav />}>
                <Route path="blogs" element={<ManageBlogs />} />
                <Route path="notifications" element={<Notifications />} />
              </Route>
              <Route path="settings" element={<SideNav />}>
                <Route path="edit-profile" element={<EditProfile />} />
                <Route path="change-password" element={<ChangePassword />} />
              </Route>
              <Route path="signin" element={<UserAuthForm type="sign-in" />} />
              <Route path="signup" element={<UserAuthForm type="sign-up" />} />
              <Route path="search/:query" element={<SearchPage />} />
              <Route path="user/:id" element={<ProfilePage />} />
              <Route path="blog/:blog_id" element={<BlogPage />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        </userContext.Provider>
      </AIModelContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
