import "./App.css";
import Layout from './components/Layout';
import Login from "./pages/Login";
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  return location?.pathname != '/login' ? <Layout /> : <Login />
}

export default App;
