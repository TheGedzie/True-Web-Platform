import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Education } from "./pages/Education"

function App() {
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/education" element={<Education />}/>
    </Routes>
   </BrowserRouter>
  )
}

export default App
