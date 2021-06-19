import React, {Component} from 'react';
// import { NavLink as RouterNavLink } from 'react-router-dom';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import { Link } from 'react-router-dom';
import '../../App.css';


function AuthNavItem(props) {

    return (
        <UncontrolledDropdown>
            <DropdownToggle nav caret>
                <i className="bi bi-person-circle" />
            </DropdownToggle>
            <DropdownMenu right>
                <div className="m-2">
                    <i className="bi bi-person gmr-notification-icon" />
                    <i className="bi bi-bell gmr-notification-icon" />
                    <i className="bi bi-archive gmr-notification-icon" />
                </div>
                <DropdownItem divider />
                <DropdownItem onClick={props.authButtonMethod}>Sign Out</DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    );
    


}

export default class NavBar extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    

    render() {

        return (

            <div>
                <Navbar className="gmr-nav navbar-expand-sm navbar-toggleable-sm box-shadow" light>
                    <NavbarBrand>
                        <img className="gmr-logo" src='/images/icon.png' alt="GMR Logo" /> <span className="gmr-app-title"> DISTRIBUTION SOURCES </span>

                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} className="mr-2" />
                    <Collapse className="d-sm-inline-flex" isOpen={this.state.isOpen} navbar>
                        <ul className="navbar-nav flex-grow gmr-navbar-collapse">
                            <NavItem>
                                <NavLink tag={Link} className="text-light" to="/">Overview</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-light" to="/SourceManager">Source Manager</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-light" to="/SourceSetup/:id">Source Setup</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-light" to="/Overdue">Overdue</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-light" to="/Revenue">Revenue</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-light" to="/CreateNew">Create</NavLink>
                            </NavItem>
                        </ul>
                    </Collapse>
                    <span className="pd-3 col-3 gmr-searchbar-container">
                        <input className="gmr-searchbar" placeholder="Search..." type="text" />
                    </span>
                    
                    <ul className="navbar-nav flex-grow">
                        
                        <NavItem>
                            <AuthNavItem
                                isAuthenticated={this.props.isAuthenticated}
                                authButtonMethod={this.props.authButtonMethod}
                                user={this.props.user} click={this.props.click}/>
                        </NavItem>
                    </ul>    
                </Navbar>
            </div>
        );
    }
}