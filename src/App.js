import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Landing from "@/pages/Landing";
import Team from "@/pages/Team";
import Testimonials from "@/pages/Testimonials";
import Audit from "@/pages/Audit";

function App() {
  const basename = window.location.hostname.endsWith("github.io")
    ? "/Nex-3-Emergent"
    : "/";

  return (
    <div className="App grain">
      <BrowserRouter
        basename={basename}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/team" element={<Team />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/audit" element={<Audit />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}

export default App;
