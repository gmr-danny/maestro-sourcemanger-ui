import React, { Component } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './sourcemanagerform.css';

var fields = require('../data/fields.json');


const ValidationSchema = Yup.object().shape({
    serviceProvider: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required')
  });



class SourcemanagerForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false, 
            data: {}
        };
    }



    editForm = () => {
        this.setState({
            edit: true, 
            data: this.props.data
        });
    }

    fieldGenerator = (errors, touched, fieldName, fieldType, index, options=[]) =>  {
        return (
            <div className="gmr-edit-header" key={index}>
                    {fieldName !== "serviceProvider" ? <h5>{fieldName}</h5>: null}
                    {!this.state.edit ? <div className={` ${fieldName === "serviceProvider" ? "gmr-edit-ServiceProvider": "gmr-fieldvalues"}`}> {this.props.data[fieldName] === null || this.props.data[fieldName] === "" ? <div>Empty</div> : `${this.props.data[fieldName]}` } </div> : 
                    <div>
                        <input  type={fieldType} name={fieldName} value={this.state.data[fieldName]} onChange={this.handleInputChange} />
                    {errors.name && touched.name ? (
                        <div>{errors.name}</div>
                    ) : null}
                        <ErrorMessage name={fieldName} />
                    </div>}

            </div>
        )
    }

    handleInputChange = (event) => {
        this.setState({
			data: {
				...this.state.data, 
				[event.target.name]: event.target.value
			}
		})
    }

    formatObj = () => {
        // Fix format of Object 
        let tempObj = this.state.data; 
        delete tempObj.sourceId;

        for (let property in tempObj) {
            let newName = property.charAt(0).toUpperCase() + property.slice(1);

            let tempVal = tempObj[property]; 

            if (newName === "Contacts") {
                let tempContactArr = []; 
                
                for (let i = 0; i < tempObj["contacts"]; i++) {
                    let tempContactObj = {}; 
                    for (let field in tempObj["contacts"][i]) {
                        let newContactField = field.charAt(0).toUpperCase() + field.slice(1);
                        tempContactObj[newContactField] = tempObj["contacts"][i][field];
                    }
                    tempContactArr.push(tempContactObj);
                }
                delete tempObj.contacts; 
                tempObj.Contacts = tempContactArr; 
            } else {
                delete tempObj[property]; 
                tempObj[newName] = tempVal;
            }

        }
        return tempObj; 
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        let tempObj = this.formatObj();

        console.log("temp object is", tempObj);


        try {
            var bearer = "Bearer " + sessionStorage.getItem("accessToken");
            var headers = new Headers();
            headers.append("Authorization", bearer);
            headers.append("Content-Type", "application/json");

            const response = await fetch('https://apim-sourcemanager-dev-001.azure-api.net/sources/PutSources', {
                headers: headers,
                //credentials: 'include',
                method: "POST",
                body: JSON.stringify(tempObj), 
                mode: 'cors'
            });
            console.log("response", response)
            //const parsedResponse = await response.json(); 

        } catch (err) {
            //console.log('err', err)
            return err; 
        };
    }


    render() { 
        console.log("Current State", this.state, this.props)
        return (
            <div className="mt-5 gmr-edit-container">
                {this.state.edit ? null : <i onClick={this.editForm} className="bi bi-pencil gmr-edit-pencil"/> }
                <Formik
                initialValues={this.props.data}
                validationSchema={ValidationSchema}
                // onSubmit={async (values) => {
                //     console.log("submit button clicked!")
                    
                // }}
                >
                    {({ errors, touched }) => {
                        const sourcefileFields = Object.keys(fields.sourceFile).map((key, index) => {
                            return this.fieldGenerator(errors, touched, key, fields.sourceFile[key], index); 
                        }); 
                        const filefreqFields = Object.keys(fields.fileFrequency).map((key, index) => {
                            return this.fieldGenerator(errors, touched, key, fields.sourceFile[key], index); 
                        }); 
                        return (
                        
                        <Form onSubmit={this.handleSubmit}>
                            <section className="gmr-edit-section">
                                {this.fieldGenerator(errors, touched, "serviceProvider", "text")}
                            </section>
                            <div className="row ml-5 mr-5 gmr-flex-1 p-2">
                                <section className="gmr-edit-section col-6"> 
                                    <h1 className="gmr-section-title-edit">Source File</h1>
                                    <div>{sourcefileFields} </div>

                                    
                                </section>
                                <section className="gmr-edit-section col-6"> 
                                    <h1 className="gmr-section-title-edit">File Frequency</h1>
                                    <div>{filefreqFields} </div>
                                </section>
                            </div>
                        {this.state.edit ? <button type="submit">Submit</button> :null }
                        </Form>
                    );
                    }}
                </Formik>
            </div>
        );
    }
}
 
export default SourcemanagerForm;