import { useState } from 'react';
import styles from './Register.module.css';
import { registerFunc } from '../../services/authApi';
import type { IRegister } from '../../types/auth.type';
import { useNavigate } from 'react-router-dom';

const initialData: IRegister = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: ""
};

const Register = () => {
  const [form, setForm] = useState(initialData);
  const navigate = useNavigate()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await registerFunc(form)

    console.log(response);

    if (response === 204) {
      navigate("/login")
    }

  };

  return (
    <div className={styles.container}>
      <div className={styles.register_container}>
        <h2 className='auth_titile'>Register</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className={styles.input}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={styles.input}
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={form.phoneNumber}
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className={styles.input}
          />
          <div className='form_bottom'>
            Already have an account? <span onClick={() => navigate('/login')}>Login</span>
          </div>
          <button type="submit" className={styles.button}>Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
