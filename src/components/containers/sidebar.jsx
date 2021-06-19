import * as React from 'react';
import "./sidebar.css";


const SideBar = (props) => (
    <section>
        <i className="bi bi-three-dots-vertical gmr-sidebar-button" onClick={props.click} > </i> 

        <div className="pt-5 pl-3 gmr-sidebar-container">

            <section>
                <h5> APPS </h5>
                <div className="gmr-sidebar-indent">
                    <p> <i className="bi bi-archive pr-1" /> Source Data Manager </p>
                </div>
            </section>
            <section>
                <h5> MY STUFF </h5>
                <div className="gmr-sidebar-indent">

                    <p> <i className="bi bi-people pr-1" /> Profile </p>
                    <p> <i className="bi bi-envelope pr-1" /> Messages </p>
                    <p><i className="bi bi-bell pr-1" /> Alerts </p>

                </div>
            </section>

        </div>
    </section>
);

export default SideBar;
