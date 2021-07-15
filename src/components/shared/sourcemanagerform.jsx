import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import './sourcemanagerform.css';

// var fields = require('../data/fields.json');
var select = require('../data/select.json');


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

    // fieldGenerator = (errors, touched, fieldName, fieldType, index, options=[]) =>  {
    //     return (
    //         <div className="gmr-edit-header" key={index}>
    //                 {fieldName !== "serviceProvider" ? <h5>{fieldName}</h5>: null}

    //                 {!this.state.edit ? <div className={` ${fieldName === "serviceProvider" ? "gmr-edit-ServiceProvider": "gmr-fieldvalues"}`}> {this.props.data[fieldName] === null || this.props.data[fieldName] === "" ? <div>Empty</div> : `${this.props.data[fieldName]}` } </div> : 
    //                 <div>
    //                     <input  type={fieldType} name={fieldName} value={this.state.data[fieldName]} onChange={this.handleInputChange} />
    //                     {errors.name && touched.name ? (
    //                         <div>{errors.name}</div>
    //                     ) : null}
    //                     <ErrorMessage name={fieldName} />
    //                 </div>}

    //         </div>
    //     )
    // }

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
            //const parsedResponse = await response.json(); 
            console.log(response);
        } catch (err) {
            //console.log('err', err)
            return err; 
        };
    }


    generateOptions = (fieldItem) => {
        return Object.keys(fieldItem).map((key, index) => {
            return (<option value={key} key={index}>{key}</option> )})
    }

    render() { 
        console.log("Current State", this.state, this.props)
        return (
            <div className="mt-5 gmr-edit-container">
                {/* {this.state.edit ? null : <i onClick={this.editForm} className="bi bi-pencil gmr-edit-pencil"/> } */}
                <Formik
                initialValues={this.props.data}
                validationSchema={ValidationSchema}
                // onSubmit={async (values) => {
                //     console.log("submit button clicked!")
                    
                // }}
                >
                    {({ errors, touched }) => {
                        // Fields do not match up to wireframe! -------------------------------------------------
                        // const sourcefileFields = Object.keys(fields.sourceFile).map((key, index) => {
                        //     return this.fieldGenerator(errors, touched, key, fields.sourceFile[key], index); 
                        // }); 
                        // const filefreqFields = Object.keys(fields.fileFrequency).map((key, index) => {
                        //     return this.fieldGenerator(errors, touched, key, fields.sourceFile[key], index); 
                        // }); 
                        return (
                        
                        <Form onSubmit={this.handleSubmit}>
                            <section className="gmr-edit-section">
                                {/* {this.fieldGenerator(errors, touched, "serviceProvider", "text")} */}
                                <h1> {this.props.data.serviceProvider} </h1>
                                <button type="submit" className="gmr-save-changes">Save Changes</button> 

                            </section>
                            <div className="row ml-5 mr-5 gmr-flex-1 p-2">
                                <section className="gmr-edit-section col-xs-12 col-sm-6"> 
                                    <h1 className="gmr-section-title-edit">Source File</h1>
                                    {/* Fields subject to change. Below is temporary */}
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">Input Type</div>
                                        <div>
                                             <Field name="inputType" as="select" className="">
                                                 {this.generateOptions(select.inputType)}
                                            </Field>
                                        </div>
                                    </div>
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">URL</div>
                                        <div>
                                             <input name="url" type="text" placeholder={this.props.data.serviceProvider} /> 
                                        </div>
                                    </div>
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">Password</div>
                                        <div>
                                            <input name="url" type="password" value={this.props.data.serviceProvider} /> 
                                        </div>
                                    </div>
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">File Path</div>
                                        <div>
                                            <input name="url" type="text" placeholder={ "/" + this.props.data.serviceProvider} /> 
                                        </div>
                                    </div>
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">Has Revenue File</div>
                                        <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                                        
                                        </div>
                                    </div>
                                    
                                </section>
                                <section className="gmr-edit-section col-xs-12 col-sm-6"> 
                                    <h1 className="gmr-section-title-edit">File Frequency</h1>
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">Delivery Frequency</div>
                                        <div>
                                             <Field name="inputType" as="select" className="">
                                                 {this.generateOptions(select.deliveryFrequency)}
                                            </Field>
                                        </div>
                                    </div>
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">Number of Files Expected</div>
                                        <div>
                                            <input name="url" type="number" placeholder="2" /> 
                                        </div>
                                    </div>
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">Expected Delivery</div>
                                        <div>
                                            <input name="expectedDelivery" type="number" placeholder="25" /> 
                                        
                                             <Field name="inputType" as="select" className="ml-1">
                                                 {this.generateOptions(select.expectedDelivery)}
                                            </Field>
                                        </div>
                                    </div>
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">Source Lag</div>
                                    
                                        <div>
                                             <Field name="inputType" as="select" className="">
                                                 {this.generateOptions(select.sourceLag)}
                                            </Field>
                                        </div>
                                    </div>
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">Source Type</div>
                                    
                                        <div>
                                             <Field name="inputType" as="select" className="">
                                                 {this.generateOptions(select.sourceType)}
                                            </Field>
                                        </div>
                                    </div>
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">Data Since</div>
                                    
                                        <div>
                                             <Field name="inputType" as="select" className="">
                                                 {this.generateOptions(select.dataSince)}
                                            </Field>
                                        
                                             <Field name="inputType" as="select" className="">
                                                 {this.generateOptions(select.dataSinceYear)}
                                            </Field>
                                        </div>
                                    </div>
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">New Source</div>
                                        <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                                        
                                        </div>
                                    </div>
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">Inactive Source</div>
                                        <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                                        
                                        </div>
                                    </div>
                                    
                                </section>
                            </div>
                            <section className="gmr-edit-section col-6">
                                <h1 className="gmr-section-title-edit">Contact</h1>
                                <div className="gmr-edit-header">
                                    <div className="gmr-fieldvalues">First Name</div>
                                    <div>
                                            <input name="url" type="text" placeholder="John" /> 
                                    </div>
                                </div>
                                <div className="gmr-edit-header">
                                    <div className="gmr-fieldvalues">Last Name</div>
                                    <div>
                                            <input name="url" type="text" placeholder="Doe" /> 
                                    </div>
                                </div>
                                <div className="gmr-edit-header">
                                    <div className="gmr-fieldvalues">Email</div>
                                    <div>
                                            <input name="url" type="email" placeholder="test@globalmusicrights.com" /> 
                                    </div>
                                </div>
                                <div className="gmr-edit-header">
                                    <div className="gmr-fieldvalues">Phone</div>
                                    <div>
                                            <input name="url" type="text" placeholder="(123) 456-8239" /> 
                                    </div>
                                </div>
                            </section>
                        </Form>
                    );
                    }}
                </Formik>
            </div>
        );
    }
}
 
export default SourcemanagerForm;