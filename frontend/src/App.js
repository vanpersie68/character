import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector} from "react-redux";
import { Navigate } from 'react-router-dom';
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Admin from "./components/admin/Admin";
import UserInfo from "./components/user/UserInfo";
import Add from "./components/main/addEdit/Add";
import Edit from "./components/main/addEdit/Edit";
import CharacterDetail from "./components/main/characters/CharacterDetail";
import ContributionList from "./components/admin/subcomponents/ContributionList";
import AdminList from "./components/admin/subcomponents/AdminList";
import CharacterList from "./components/admin/subcomponents/CharacterList";

function App() {
  const token = useSelector((state) => state.user.user.token);

  return (
    <div className="dark">
      <Router>
        <Routes>
          {/* The following are places to configure routes */}
          <Route exact path="/" element={token ? <Home /> : <Navigate to="/login" /> } />
          <Route exact path="/login" element={!token ? <Login /> : <Navigate to="/" />}  />
          <Route exact path="/register" element={!token ? <Register /> : <Navigate to="/" />} />

          <Route exact path="/add" element={token ? <Add /> : <Navigate to="/login" />} />
          <Route exact path="/edit" element={token ? <Edit /> : <Navigate to="/login" />} />

          <Route exact path="/character" element={token ? <CharacterDetail /> : <Navigate to="/login" />} />
          <Route exact path="/user" element={token ? <UserInfo /> : <Navigate to="/login" />} />
          <Route exact path="/admin" element={token ? <Admin /> : <Navigate to="/login" />} />

          
          <Route path="/admin/characters" element={token ? <CharacterList /> : <Navigate to="/login" />} />
          <Route path="/admin/contributions" element={token ? <ContributionList /> : <Navigate to="/login" />} />
          <Route path="/admin/admins" element={token ? <AdminList /> : <Navigate to="/login" />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
