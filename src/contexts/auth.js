import { useState, createContext, useEffect } from 'react';
import { auth, db } from '../services/firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
 
export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser ] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadUser  = async () => {
      const storageUser  = localStorage.getItem('@ticketsPRO');

      if (storageUser ) {
        setUser (JSON.parse(storageUser ));
      }

      setLoading(false);
    };

    loadUser ();
  }, []);

  const handleUserState = (userData) => {
    setUser (userData);
    localStorage.setItem('@ticketsPRO', JSON.stringify(userData));
  };

  async function signIn(email, password) {
    setLoadingAuth(true);
    try {
      const value = await signInWithEmailAndPassword(auth, email, password);
      const uid = value.user.uid;
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      const data = {
        uid,
        nome: docSnap.data().nome,
        email: value.user.email,
        avatarUrl: docSnap.data().avatarUrl,
      };

      handleUserState(data);
      toast.success("Bem-vindo(a) de volta!");
      navigate("/home");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Ops, algo deu errado!");
    } finally {
      setLoadingAuth(false);
    }
  }

  async function signUp(email, password, name) {
    setLoadingAuth(true);
    try {
      const value = await createUserWithEmailAndPassword(auth, email, password);
      const uid = value.user.uid;

      await setDoc(doc(db, "users", uid), {
        nome: name,
        avatarUrl: null,
      });

      const data = {
        uid,
        nome: name,
        email: value.user.email,
        avatarUrl: null,
      };

      handleUserState(data);
      toast.success("Seja bem-vindo ao sistema!");
      navigate("/home");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      toast.error("Ops, algo deu errado!");
    } finally {
      setLoadingAuth(false);
    }
  }

  async function logout() {
    await signOut(auth);
    localStorage.removeItem('@ticketsPRO');
    setUser (null);
  }

  return (
    <AuthContext.Provider 
      value={{
        signed: !!user,
        user,
        signIn,
        signUp,
        logout,
        loadingAuth,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;