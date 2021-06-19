import React, {Component} from 'react';

import SourcemanagerForm from '../shared/sourcemanagerform';

import './sourcesetup.css';



export default class SourceSetup extends Component {

    constructor(props) {
        super(props);

        this.state = {
            responseObj: {
                "ServiceProvider": "",
                "Frequency": "",
                "Source": "",
                "SourceType": "",
                "ProvidesRevenueReport": 1,
                "ProvidesCueSheets": 0,
                "AgreedDataFrequency": "",
                "DurationOfFiles": "",
                "Comments": null,
                "Performance": null,
                "Service": null,
                "ToDo": "",
                "IsActive": 1,
                "ContactInformation": [
                    {
                    "FirstName":"Test"
                    ,"MiddleName":"Contact"
                    ,"LastName":"A"
                    ,"Email":""
                    }
                ]
            }
        }
    }


    componentDidMount() {
        let parameters = this.props.match.params;
        let id = Object.values(parameters)[0];

        this.getDetails(id); 
    }

    getDetails = async (id) => {
        try {
            var bearer = "Bearer " + sessionStorage.getItem("accessToken");
            var headers = new Headers();
            headers.append("Authorization", bearer);

            const response = await fetch('https://apim-sourcemanager-dev-001.azure-api.net/sources/GetSources?code=7tkeD53T1pNnMpSlalJKpeXzCaSCMxC3R0m4LFWBf0h/5qmOjbh0gg==&sourceid=' + id, {
                headers: headers, 
                mode: 'cors'
            });
            const parsed = await response.json();
            this.setState({

                responseObj: {...parsed}
            });
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        // swap between Edit and Detailed View
        console.log("Response Object", this.state.responseObj)
        return (
            <div>{this.state.responseObj != null ? <SourcemanagerForm data={this.state.responseObj} /> :
            <div className="spinner-border" role="status">
                <span className="sr-only"></span>
            </div>
            } </div>
        );
    }


}



