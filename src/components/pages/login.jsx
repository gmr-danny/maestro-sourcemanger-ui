import React, {Component} from 'react';

import './login.css';


export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showLoading: false
        }
    }

    showLoadingSpinner = () => {
        this.props.authButtonMethod(); 
        this.setState({
            showLoading: true
        })
    }



    render() {
        return (
            <div className="gmr-login-backgroundimage" >
                {/* <video muted loop id="myVideo" autoPlay>
                    <source src="/images/LoginBackground.mp4" type="video/mp4"/>
                </video> */}
                <div className="gmr-login-modal"> <img src="/images/logo.png" alt="maestro_logo" />
                    {this.state.showLoading === false ? <h5 onClick={this.showLoadingSpinner}> Login </h5> :
                        <div className="spinner-border" role="status">
                            <span className="sr-only"></span>
                        </div>
                        
                        }

                </div>
            </div>
        );
    }


}
