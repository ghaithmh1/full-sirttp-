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
import Home from './components/usercomponents/home.jsx';
import ChoixEntreprise from'./components/entreprise/choixEntreprise.jsx';
import JoindreEntreprise from'./components/entreprise/JoindreEntreprise.jsx';
import ProduitManager from './components/Produit/produitManager.jsx';
import DemandePrixManager from './components/DemandePrix/demandePrixManager.jsx';
import BonCommandeManager from './components/BonCommande/bonCommandeManager.jsx';

function App() {
  return (
    <BrowserRouter>
      <div id="modal-root"></div>
      <div className="container py-4">
        <Routes>
          <Route path="/Register" element={<Register />} />

          <Route path="/login" element={<Login />} />
          <Route path="/entreprise" element={<CreateEntreprise />} />
          <Route path="/joindreEntreprise" element={<JoindreEntreprise />} />
          <Route path="/ChoixEntreprise" element={<ChoixEntreprise />} />

          <Route path="/home" element={<Home />} />


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
          <Route path="/produits" element={<ProduitManager />} />
          <Route path="/demandesPrix" element={<DemandePrixManager/>} />
          <Route path="/bonsCommande" element={<BonCommandeManager/>} />


        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;    