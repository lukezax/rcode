import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Home from './pages/Home';
import TargetDetail from './pages/TargetDetail';
import CodeDetail from './pages/CodeDetail';
import UploadCode from './pages/UploadCode';
import ApplyTarget from './pages/ApplyTarget';
import Login from './pages/Login';
import Register from './pages/Register';
import UserCenter from './pages/UserCenter';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="targets/:id" element={<TargetDetail />} />
          <Route path="codes/:id" element={<CodeDetail />} />
          <Route path="upload" element={<UploadCode />} />
          <Route path="apply" element={<ApplyTarget />} />
          <Route path="user" element={<UserCenter />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
