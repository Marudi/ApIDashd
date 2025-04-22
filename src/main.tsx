
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import 'reactflow/dist/style.css';

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
