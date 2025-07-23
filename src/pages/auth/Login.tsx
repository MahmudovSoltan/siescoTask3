import { useState } from 'react';
import styles from './Login.module.css';
import type { IRegister } from '../../types/auth.type';
import { loginFunc } from '../../services/authApi';
import { useNavigate } from 'react-router-dom';
const initialData :Pick<IRegister, 'password' | 'email'> = {
  email: "",
  password: "",

}
const Login = () => {
  const [form, setForm] = useState(initialData);
  const navigate = useNavigate()
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit =  async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await loginFunc(form)
    console.log(response);
    const accessToken = response.accessToken
    const refreshToken = response.refreshToken
    localStorage.setItem("accessToken",accessToken)
    localStorage.setItem("refresh",refreshToken) 
    if (refreshToken && accessToken) {
      navigate("/user_table")
    }   
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Login</button>
      </form>
    </div>
  );
};

export default Login;
