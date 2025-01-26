import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from './views/Layout';
import Home from './views/Home';
import DetectFace from './views/DetectFace';
import Detected from './views/Detected';
import { useStore } from './stores/dbStore';
import { useEffect } from 'react';

const App = () => {
  const init = useStore((state) => state.init);

  useEffect(() => {
    init();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/face" element={<DetectFace />} />
          <Route path="/detected" element={<Detected />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
