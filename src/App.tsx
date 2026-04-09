import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Education } from "./pages/Education"
import { PreviewCourse } from "./pages/PreviewCourse"

function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/education" element={<Education />}/>
      <Route path = "/education/:id" element={<PreviewCourse />}/>
    </Routes>
   </BrowserRouter>
  )
}

export default App
