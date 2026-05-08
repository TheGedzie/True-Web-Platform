import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Education } from "./pages/Education"
import { PreviewCourse } from "./pages/PreviewCourse"
import { Start } from "./pages/Start"
import { Course } from "./pages/Course"
import { Courses } from "./pages/Courses"
import { RegisterAuth } from "./pages/RegisterAuth"

function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/education" element={<Education />}/>
      <Route path = "/education/:id" element={<PreviewCourse />}/>
      <Route path="/course/:id" element={<Course />}></Route>
      <Route path="/" element={<Start />}/>
      <Route path="/courses" element={<Courses />}/>
      <Route path="/register" element={<RegisterAuth />}/>
    </Routes>
   </BrowserRouter>
  )
}

export default App
