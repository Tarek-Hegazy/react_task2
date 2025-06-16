import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavBar, Layout } from "@components";
import {
  HomePage,
  Login,
  Register,
  Profile,
  PostList,
  SinglePost,
} from "@pages";
import AuthGurdRoute from "./components/AuthGurd";

function App() {
  return (
    <Router>
      <NavBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<AuthGurdRoute />}>
            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
            <Route
              path="/posts"
              element={
                <Layout>
                  <PostList />
                </Layout>
              }
            />
            <Route
              path="/posts/:id"
              element={
                <Layout>
                  <SinglePost />
                </Layout>
              }
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
