// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import React from "react";
import { Modal, Button } from "react-bootstrap";
import Loader from "react-loader";

export default class SignUp extends React.Component {
    errorMessage = "An error occured while registering. Please try again later";
    constructor(props) {
        super(props);
        this.state = {name: '', email: '', phone: '', errorMessage: '', isOpen: false, loaded: true, isError: false};
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
    }

    handleNameChange(event) {
        event.preventDefault();
        this.setState({name: event.target.value});
    }

    handleEmailChange(event) {
        event.preventDefault();
        this.setState({email: event.target.value});
    }

    handlePhoneChange(event) {
        event.preventDefault();
        this.setState({phone: event.target.value});
    }
    handleErrors(response) {
        if (!response.ok) {
            console.log(response.statusText);
            throw Error(response.statusText);
        }
        return response;
    }
    // this handler would calls the sign up API for updating the user details in the backend
    signUp = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify ({
                name: this.state.name.toString(),
                email: this.state.email.toString(),
                phone: this.state.phone.toString()
            })
        };
        this.setState({loaded: false, isError: false});
        fetch(process.env.REACT_APP_DB_SIGNUP_API + '/signupdb', requestOptions)
        //handle any non-network errors
        .then(this.handleErrors)
        .then( 
            // api success
             (response) => {
              // if d/b update is successful, send an email   
              this.signupSns() 
              
            },
            // api error
            (error) => {
                this.setState({loaded: true, isError: true});
                console.log(error);
            }
        )
        //catch status check error 
        .catch((error) => {
            this.setState({loaded: true, isError: true});
        }
      )
    };
    // this calls the signupsns API to notify via a SNS topic 
    signupSns = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify ({
                name: this.state.name.toString(),
                email: this.state.email.toString()
            })
        };
        fetch(process.env.REACT_APP_SNS_SIGNUP_API + '/signupsns', requestOptions)
        // handle non-network errors
        .then(this.handleErrors)
        .then( 
            // api sucess
            (response) => { 
              this.setState({loaded: true});
              this.openModal();
            },
            // api error
            (error) => {
                console.log(error);
                this.setState({loaded: true, isError: true});
            }
        )
        // catch status check error
        .catch((error) => {
            this.setState({loaded: true,  isError: true});
         }
        )
    };
    
    openModal = () => this.setState({ isOpen: true });
    closeModal = () => this.setState({ isOpen: false });
    
    render() {
        return(
            <div className="container">
                    <Loader loaded={this.state.loaded}></Loader>
                    <div className="form-group row">
                    <label className="col" htmlFor="name">Name</label>
                    <input type="text" className="form-control col-9" name="name" 
                        placeholder="Your name" value={this.state.name} onChange={this.handleNameChange}/>
                    </div>
                    <div className="form-group row">
                    <label className="col">Email</label>
                    <input type="text" className="form-control col-9" name="Email" placeholder="Your Email Address"
                        value={this.state.email} onChange={this.handleEmailChange}/>
                    </div>
                    <div className="form-group row">
                    <label className="col" >Phone Number</label>
                    <input type="text" className="form-control col-9" name="Email" placeholder="Your Phone Number"
                        value={this.state.phone} onChange={this.handlePhoneChange}/>
                    </div>
                    <button type="button" disabled={!this.state.email || !this.state.name || !this.state.phone} className="btn btn-primary btn-lg" 
                            onClick={this.signUp}>Sign Up
                    </button>
                    
                    <div className="row">
                        {this.state.isError === true && (
                            <div className="col-lg err">{this.errorMessage}</div>
                        )}
                    </div>
                    <Modal show={this.state.isOpen} onHide={this.closeModal} >
                        <Modal.Header closeButton>
                            <h3>
                                <Modal.Title>Registered</Modal.Title>
                            </h3>
                        </Modal.Header>
                        <Modal.Body>
                            Hey {this.state.name}, you have been successfully registered for this product
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.closeModal}>Close</Button>
                        </Modal.Footer>
                    </Modal>
            </div>
        );
    }

}   
