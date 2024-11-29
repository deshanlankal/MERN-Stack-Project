import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    // Validate password on input change
    if (id === 'password') {
      validatePassword(value);
    }
  };

  // Password validation function
  const validatePassword = (password) => {
    const lengthValid = password.length >= 6;
    const containsNumber = /\d/.test(password);
    const containsUppercase = /[A-Z]/.test(password);

    if (!lengthValid || !containsNumber || !containsUppercase) {
      setPasswordError(
        'Password must be at least 6 characters long, contain numbers, and have at least one uppercase letter.'
      );
      return false;
    }

    setPasswordError(null); // Clear error if valid
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaValue) {
      setError('Please complete the reCAPTCHA to proceed.');
      return;
    }
     // Validate password
     if (formData.password && !validatePassword(formData.password)) {
      setError('Password is invalid. Please fix the errors.');
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='username'
          className='border p-3 rounded-lg'
          id='username'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />
       {passwordError && (
          <p className='text-red-500 text-sm mt-1'>{passwordError}</p>
        )}

        {/* reCAPTCHA Component */}
        <ReCAPTCHA
          sitekey="6Le_YI0qAAAAAIdLI3MxiRpubEC5tCwzDfXWc0tf"
          onChange={(value) => setCaptchaValue(value)} // Captures the token on success
        />

        <button
          disabled={loading || !captchaValue}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
