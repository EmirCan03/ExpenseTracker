import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate, Link } from 'react-router-dom'; 
import Input from "../../components/inputs/input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const Login = () => {
  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate =useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)) {
      setError("Lütfen geçerli email adresi girin"); 
      return;
    }
    if(!password) {
      setError("Lütfen şifrenizi girin");
      return;
    }
        setError("");
    // Login API Call
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
            email,
            password,
        });

        const { token, user } = response.data;

        if (token) {
            localStorage.setItem("token", token);
            updateUser(user);
            navigate("/dashboard");
        }
    } catch (error) {
        if (error.response && error.response.data.message) {
            setError(error.response.data.message);
        } else {
            setError("Something went wrong. Please try again.");
        }
    }
  }
  
  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-lg  font-semibold text-black '>Tekrar Hoşgeldiniz</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Giriş yapmak için lütfen bilgilerinizi girin</p>
        <form onSubmit={handleLogin}>
          <Input 
          value={email} 
          onChange={({ target }) => setEmail(target.value)}
          label="Email Adres"
          placeholder="username@gmail.com"
          type='text'
          />
          <Input 
          value={password} 
          onChange={({ target }) => setPassword(target.value)}
          label="Şifre"
          placeholder="min 8 karakter"
          type='password'
          />
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type="submit" className="btn-primary">Giriş Yap</button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Bir hesaba sahip değil misiniz?{" "}
            <Link className="font-medium text-primary underline" to="/signup">Kayıt Ol</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login