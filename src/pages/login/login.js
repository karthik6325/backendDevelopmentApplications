import React, { useState } from 'react'
import './login.css'
import { Link } from 'react-router-dom'

const Login = () => {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    return (
        <div className="joinOuterContainer">
            <div className="logo">
                <p>Logo</p>
            </div>
            <div className="joinInnerContainer">
                <h1 className="heading">Join</h1>
                    <div>
                        <input className="joinInput" onChange={(e) => setName(e.target.value)} type="text" placeholder="Username" required />
                    </div>
                    <div>
                        <input className="joinInput mt-20" onChange={(e) => setRoom(e.target.value)} type="text" placeholder="Room" required  />
                    </div>
                    <Link onClick={e => (!name || !room) ? e.preventDefault() : null}
                        to={`/chat?name=${name}&room=${room}`}>
                        <button type="submit" className="button mt-20" value="Log In">Join</button>
                    </Link>
            </div>
        </div>
    )
}

export default Login;