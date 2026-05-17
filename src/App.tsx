import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Welcome } from "./pages/Welcome"
import { PreviewCourse } from "./pages/PreviewCourse"
import { Start } from "./pages/Start"
import { Course } from "./pages/Course"
import { Courses } from "./pages/Courses"
import { RegisterAuth } from "./pages/RegisterAuth"
import { Profile } from "./pages/Profile"
import { Challenges } from "./pages/Chellenges/Challenges"
import { Challenge } from "./pages/Challenge/Challenge"

function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/education" element={<Welcome />}/>
      <Route path = "/education/:id" element={<PreviewCourse />}/>
      <Route path="/course/:id" element={<Course />}></Route>
      <Route path="/" element={<Start />}/>
      <Route path="/courses" element={<Courses />}/>
      <Route path="/register" element={<RegisterAuth />}/>
      <Route path="/profile" element={<Profile />}/>
      <Route path="/challenges" element={<Challenges />} />
       <Route path="/challenge/:id" element={<Challenge />} />
    </Routes>
   </BrowserRouter>
  )
}

export default App
