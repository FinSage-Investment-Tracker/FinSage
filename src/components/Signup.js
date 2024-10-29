import React, {useState} from 'react'
import { useNavigate, Link} from 'react-router-dom'

const Signup = () => {

  const [credentials, setCredentials] = useState({name:"", email: "", password: "", cpassword: ""})
  let navigate = useNavigate();

  const handleSubmit = async (e) =>{
    const host = "http://localhost:5000";
    e.preventDefault();
    const response = await fetch(`${host}/api/auth/createuser`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password })
      });
        const json = await response.json();
        // console.log(json);
        if(json.success){
          //save authtoken and redirect
          localStorage.setItem("token", json.authtoken);
          navigate("/login");
        }
        else{
          alert( "Invalid credentials");
        }
  }

  const onChange = (e) =>{
      setCredentials({...credentials, [e.target.name]: e.target.value})
  }

  return (
    <div className='container col-md-4 mx-auto mb-5 mt-3'>
    <h2>Signup</h2>
        <form onSubmit={handleSubmit} >
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" className="form-control" id="name" name='name' aria-describedby="emailHelp" onChange={onChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" name='email' aria-describedby="emailHelp" onChange={onChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" name='password' onChange={onChange} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                <input type="password" className="form-control" id="cpassword" name='cpassword' onChange={onChange} required/>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        <Link className="signup-link" to="/login">Already have an account? Log in</Link>
    </div>
  )
}

export default Signup