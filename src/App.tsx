import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Welcome } from "./pages/Welcome";
import { PreviewCourse } from "./pages/PreviewCourse";
import { Start } from "./pages/Start";
import { Course } from "./pages/Course";
import { Courses } from "./pages/Courses";
import { RegisterAuth } from "./pages/RegisterAuth";
import { Profile } from "./pages/Profile";
import { Challenges } from "./pages/Chellenges/Challenges";
import { Challenge } from "./pages/Challenge/Challenge";
import { Questions } from "./pages/Questions";
import { Question } from "./pages/Question";
import { ScrollToTop } from "./utils/ScrollTop/ScrollTop";
import { AuthGuard } from "./utils/AuthGuard/AuthGuard";
import { ProtectedRoute } from "./utils/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<AuthGuard />}>
          <Route path="/register" element={<RegisterAuth />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/education" element={<Welcome />} />
          <Route path="/education/:id" element={<PreviewCourse />} />
          <Route path="/course/:id" element={<Course />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/challenge/:id" element={<Challenge />} />
          <Route path="/forum" element={<Questions />} />
          <Route path="/forum/:id" element={<Question />} />
        </Route>

        <Route path="*" element={<Start />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
