import React, { useState } from 'react'

const SignupForm = ({ createUser }) => {
    const [email, setEmail] = useState(''),
          [password, setPassword] = useState(''),
          [name, setName] = useState('') 
    return (
        <div style={{textAlign: 'center', marginTop: 50 }}>
            <form onSubmit={(e) => {
                e.preventDefault()
                createUser({ variables: { email, password, name } })
            }} style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <h1>Sign Up</h1>
                <input
                    required
                    name='email'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter your email'
                    style={{padding: 10, margin: '10px 0px', width: '50%'}}
                />
                <input
                    required
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value) }
                    placeholder='Enter your password'
                    style={{padding: 10, margin: '10px 0px', width: '50%'}}
                />
                <input
                    required
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value) }
                    placeholder='Enter your name'
                    style={{padding: 10, margin: '10px 0px', width: '50%'}}
                />
                <button type='submit' style={{padding: 10, margin: '10px 0px', width: '50%'}}>SignUp</button>
            </form>
        </div>
    )
}

export default SignupForm