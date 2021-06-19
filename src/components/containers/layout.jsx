import * as React from 'react';
// import PropTypes from 'prop-types';
 
const Layout = (props) => {
    return (
        <React.Fragment>
            <div>
                {props.children}
            </div>
        </React.Fragment>  
    );
}
 
Layout.propTypes = { children: React.ReactNode};
 
export default Layout;