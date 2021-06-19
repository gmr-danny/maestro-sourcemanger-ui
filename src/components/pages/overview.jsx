import React, {Component} from 'react';
import DataTable from 'react-data-table-component';

import './overview.css';
var titles = require('../data/data.json');


export default class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            datapoints:[],
        };
    }

    componentDidMount() {
        this.getData(); 
    }

    getData = async () => {
        try {
            var bearer = "Bearer " + sessionStorage.getItem("accessToken");
            var headers = new Headers();
            headers.append("Authorization", bearer);

            const response = await fetch('https://apim-sourcemanager-dev-001.azure-api.net/sources/GetSources', {
                mode: "cors",
                headers: headers
            });

            const parsed = await response.json();
            this.setState({
                
                datapoints: [...parsed]
            });
        } catch (err) {
            console.log(err);
        }
    }

    goToEditPage = (id) => {

    }

    goToViewDetailPage = (id) => {
        window.location.href = '/SourceSetup/' + id;
    }

    render() {

        return (
            <div>
                {
                    this.state.datapoints.length === 0 ? 
                        <div className="gmr-handle-spinner">
                            <div className="spinner-border" role="status">
                                <span className="sr-only"></span>
                            </div>
                        </div>
                        :
                        <Table datapoints={this.state.datapoints} sort={this.sort} goToViewDetailPage={this.goToViewDetailPage} goToEditPage={this.goToEditPage} />

                }

            </div>
        );
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
}


const Table = (props) => {
    const data = props.datapoints;
    console.log("datapoints: ", data, "title:" , titles.Response)

    return (
        <DataTable keyField="id" striped={true} highlightOnHover={true} pointerOnHover={true} onRowClicked={(e)=>{window.location.href = '/SourceSetup/' + e.sourceId;}} responsive={true} columns={titles.Response} data={data}/> 
        
        );
};