import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/forgotpwd", { email });
      setMessage(res.data.message);

      // Si succès, naviguer vers le reset password
      if (res.status === 200) {
        // Tu peux passer l'email dans l'état de navigation
        navigate("/resetpass", { state: { email } });
      }

    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur serveur");
    }
  };

  return (
    <div>
      <h2>Mot de passe oublié</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <button type="submit">Envoyer le code</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
