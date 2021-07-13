import React, { Component } from 'react';
// import { BrowserRouter as Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
// import Layout from './components/containers/layout';
import NavBar from './components/containers/navbar';
import SideBar from './components/containers/sidebar';
import Login from './components/pages/login';
import AllRoutes from './components/shared/routes';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      closed: true,
      loggedIn: false, 
      allowAuth: null

    };
  }

  openSideBar = () => {
      console.log("openSideBar clicked", this.state.closed)
    this.setState({
        closed: !this.state.closed
    });
  }


  componentDidMount() {
     // this.checkLogin(this.state.allowAuth); 
  }



  checkIfLoginButtonPressed = () => {
      this.props.login(); 

      this.setState({
          allowAuth: true
      });

  }

  render() { 
    return (
        <div> 
            {this.props.isAuthenticated ?  
                <div className="gmr-box">
                    <NavBar
                        isAuthenticated={this.props.isAuthenticated}
                        authButtonMethod={this.props.logout}
                        user={this.props.user}  />

                    <div className="row ml-5 mr-5 gmr-flex-1" >
                        <div className={`gmr-sidebar ${this.state.closed ? "" : "gmr-open-sidebar"}`}> <SideBar click={this.openSideBar} /> </div>
                        <div className="col-11 pt-5 mt-1 gmr-container">
                            {
                                this.props.roles[0] !== "Sources.Read" ? <h2 className="mt-5">You do not have access, please contact your manager.</h2> : <AllRoutes />
                            }
                            
                        </div>
                    </div>
                </div>
                :
                <Login authButtonMethod={this.checkIfLoginButtonPressed} />
            }
        </div> //was <Router/> before 
    );
  }
}
 
export default App;
