import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/register/register.jsx';
import Login from './components/login/login.jsx';
import CreateEntreprise from './components/entreprise/creerEntreprise.jsx';
import ArticleList from './components/article/ArticleList';
import ArticleForm from './components/article/ArticleForm';
import CarForm from './components/car/CarForm';
import CarList from './components/car/CarList';
import FournisseurList from './components/fournisseur/FournisseurList';
import FournisseurForm from './components/fournisseur/FournisseurForm';
import ClientManager from "./components/Client/clientManager";
import FournisseurManager from "./components/Fournisseurs/fournisseurManager";
import SousTraitantManager from "./components/SousTraitant/sousTraitantManager";
function App() {
  return (
    <BrowserRouter>
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/entreprise" element={<CreateEntreprise />} />


          <Route path="/Article" element={<ArticleList />} />
          <Route path="/createArticle" element={<ArticleForm />} />
          <Route path="/editArticle/:id" element={<ArticleForm />} />



          <Route path="/car" element={<CarList />} />
          <Route path="/createCar" element={<CarForm />} />
          <Route path="/editCar/:id" element={<CarForm />} />



          <Route path="/Fournisseur" element={<FournisseurList />} />
          <Route path="/createFournisseur" element={<FournisseurForm />} />
          <Route path="/editFournisseur/:id" element={<FournisseurForm />} />


          <Route path="/clients" element={<ClientManager />} />
          <Route path="/fournisseurs" element={<FournisseurManager />} />
          <Route path="/sousTraitants" element={<SousTraitantManager />} />


        </Routes>
        
      </div>
    </BrowserRouter>
  );
}

export default App;    