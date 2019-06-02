import React, { Component } from 'react'

export default class LoginForm extends Component {
    state = {
        email: '',
        password: ''
    }

    onChange = e => { this.setState({ [e.target.name]: e.target.value }) }

    onSubmit = e => {
        const { email, password } = this.state
        e.preventDefault()
        this.props.login({ variables: { email, password } })
    }

    render() {
        return (
            <div style={{textAlign: 'center', marginTop: 50 }}>
                <form onSubmit={this.onSubmit} style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <h1>Login</h1>
                    <input
                        required
                        name='email'
                        type='email'
                        value={this.state.email}
                        onChange={this.onChange}
                        placeholder='Enter your email'
                        style={{padding: 10, margin: '10px 0px', width: '50%'}}
                    />
                    <input
                        required
                        name='password'
                        type='password'
                        value={this.state.password}
                        onChange={this.onChange}
                        placeholder='Enter your password'
                        style={{padding: 10, margin: '10px 0px', width: '50%'}}
                    />
                    <button type='submit' style={{padding: 10, margin: '10px 0px', width: '50%'}}>Login</button>
                </form>
            </div>
        )
    }
}
