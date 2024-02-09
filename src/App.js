import { BrowserRouter, Route, Routes } from 'react-router-dom';
// Import your page components
import NavBar from './components/NavBar';
import Home from './pages/Home';
import About from './pages/About';
import Campaigns from './pages/Campaigns';
import Create from './pages/Create';

function App() {
  return (
    <BrowserRouter>
      <div className="appContainer">
        <NavBar />
        <Routes> {/* Define your routes here */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Campaigns />} />
          <Route path="/contact" element={<Create />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
