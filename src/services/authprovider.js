import React, {Component} from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { BrowserRouter } from 'react-router-dom';


import App from '../App';

const config = {
    appId: '300a4563-8bfd-4afb-833b-bdb827cd12d2',
    scopes: [
        'api://sources/FullAccess', 
    ],
};



export default class AuthProvider extends Component {
        constructor(props) {
            super(props); 
            this.state = {
                isAuthenticated: false, 
                user: {}, 
                error: null
            };

            this.publicClientApplication = new PublicClientApplication({
                auth: {
                    clientId: config.appId,
                    redirectUri: process.env.REACT_APP_REDIRECT_URL,
                    authority: "https://login.microsoftonline.com/e6775d1a-9e02-49ad-a2de-19fa4c0a1078"
                },
                cache: {
                    cacheLocation: "sessionStorage",
                    storeAuthStateInCookie: true
                }
            });

        }

        componentDidMount() {
            console.log("RedirectURI:", process.env.REACT_APP_REDIRECT_URL)
            // If MSAL already has an account, the user
            // is already logged in
            const accounts = this.publicClientApplication.getAllAccounts();
            console.log("accounts found", accounts)
            if (accounts && accounts.length > 0) {
                // Enhance user object with data from Graph
                console.log("No current loggedin Accounts")
                this.getUserProfile(null);
            }
        }

        render() {
            console.log("at authprovider", this.state.isAuthenticated)
            return (
                <BrowserRouter>
                    <App
                    error={this.state.error}
                    isAuthenticated={this.state.isAuthenticated}
                    user={this.state.user}
                    login={() => this.login()}
                    logout={() => this.logout()}
                    getAccessToken={(scopes) => this.getAccessToken(scopes)}
                    setError={(message, debug) => this.setErrorMessage(message, debug)}
                    {...this.props} />
                </BrowserRouter>
                );
        }

        async login() {
            console.log("login() popup called")

            try {
                // Login via popup
                await this.publicClientApplication.loginPopup(
                    {
                        scopes: config.scopes,
                        prompt: "select_account"
                    });

                // After login, get the user's profile
                await this.getUserProfile();

                // window.location.href = '/';
            }
            catch (err) {
                console.log("Error:", err)
                this.setState({
                    isAuthenticated: false,
                    user: {},
                    error: this.normalizeError(err)
                });
            }
        }

        logout() {
            this.publicClientApplication.logout();
            sessionStorage.clear();
        }

        async getAccessToken(scopes) {

            try {

                const accounts = this.publicClientApplication
                    .getAllAccounts();

                if (accounts.length <= 0) throw new Error('login_required');
                // Get the access token silently
                // If the cache contains a non-expired token, this function
                // will just return the cached token. Otherwise, it will
                // make a request to the Azure OAuth endpoint to get a token
                var silentResult = await this.publicClientApplication
                    .acquireTokenSilent({
                        scopes: scopes, //scopes,
                        account: accounts[0]
                    });
                console.log("Returning token silently", silentResult)
                sessionStorage.setItem("accessToken", silentResult.accessToken);
                //sessionStorage.setItem("idToken", silentResult.idToken);


                return silentResult.accessToken;
            } catch (err) {
                // If a silent request fails, it may be because the user needs
                // to login or grant consent to one or more of the requested scopes
                if (this.isInteractionRequired(err)) {
                    var interactiveResult = await this.publicClientApplication
                        .acquireTokenPopup({
                            scopes: scopes
                        });
                    console.log("Returning token from Oauth Endpoint")
                    return interactiveResult.accessToken;
                } else {
                    console.log("err")
                    throw err;
                }
            }
        }

        async getUserProfile() {
            try {
                var accessToken = await this.getAccessToken(config.scopes);
                if (accessToken) {
                    // Get the user's profile from Graph
                   // var user = await getUserDetails(accessToken);
                   // console.log("User:", user)

                    this.setState({
                        isAuthenticated: true,
                        error: null
                    });
                
                }
            }
            catch (err) {
                this.setState({
                    isAuthenticated: false,
                    user: {},
                    error: this.normalizeError(err)
                });
            }
        }

        setErrorMessage(message, debug) {
            this.setState({
                error: { message: message, debug: debug }
            });
        }

        normalizeError(error) {
            var normalizedError = {};
            if (typeof (error) === 'string') {
                var errParts = error.split('|');
                normalizedError = errParts.length > 1 ?
                    { message: errParts[1], debug: errParts[0] } :
                    { message: error };
            } else {
                normalizedError = {
                    message: error.message,
                    debug: JSON.stringify(error)
                };
            }
            return normalizedError;
        }

        isInteractionRequired(error) {
            if (!error.message || error.message.length <= 0) {
                return false;
            }

            return (
                error.message.indexOf('consent_required') > -1 ||
                error.message.indexOf('interaction_required') > -1 ||
                error.message.indexOf('login_required') > -1 ||
                error.message.indexOf('no_account_in_silent_request') > -1
            );
        }

    
}

