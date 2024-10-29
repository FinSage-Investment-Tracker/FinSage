import React, {useState} from 'react'
import { useNavigate, Link} from 'react-router-dom'

const Login = () => {

    const [credentials, setCredentials] = useState({email: "", password: ""})
    let navigate = useNavigate();

    const handleSubmit = async (e) =>{
        const host = "http://localhost:5000";
        e.preventDefault();
        const response = await fetch(`${host}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
          });
          const json = await response.json();
          if(json.success){
            //save authtoken and redirect
            localStorage.setItem("token", json.authtoken);
            navigate("/");
          }
          else{
            alert("Invalid credentials")
          }
    }

    const onChange = (e) =>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

  return (
    <div className='container col-md-4 mx-auto mb-5 mt-3'>
        <h2>Login</h2>
        <form onSubmit={handleSubmit} >
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" name="email" value={credentials.email} onChange={onChange} aria-describedby="emailHelp" required/>
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" id="password" name="password" value={credentials.password} onChange={onChange} className="form-control" required/>
        </div>
        <button type="submit" className="btn btn-primary" >Submit</button>
        </form>
        <Link className="signup-link" to="/signup">Don't have an account? Sign up</Link>
    </div>
  )
}

export default Login