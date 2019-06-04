import React, { useState } from 'react'

const LoginForm = ({ login }) => {
    const [email, setEmail] = useState(''),
          [password, setPassword] = useState('')
    return (
        <div style={{textAlign: 'center', marginTop: 50 }}>
            <form onSubmit={(e) => {
                e.preventDefault()
                login({ variables: { email, password } })
            }} style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <h1>Login</h1>
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
                <button type='submit' style={{padding: 10, margin: '10px 0px', width: '50%'}}>Login</button>
            </form>
        </div>
    )
}

export default LoginForm
