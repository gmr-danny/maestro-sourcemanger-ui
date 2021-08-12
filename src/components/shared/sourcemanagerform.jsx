import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import './sourcemanagerform.css';

// var fields = require('../data/fields.json');
var select = require('../data/select.json');
var mockData = require('../data/mockdata.json');


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

    componentDidMount() {
        if (window.location.href === `${process.env.REACT_APP_REDIRECT_URL}/CreateNew`) {
            this.setState({
                edit: true
            });
        }
    }

    editForm = () => {
        this.setState({
            edit: true
            // data: this.props.data
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

    addContact = () => {
        return (
            <div className="fieldsection"> 

            <div className="gmr-edit-header">
                <div className="gmr-fieldvalues">First Name</div>
                <div>
                    {this.state.edit? 
                        <input name="contact_2_first_name" type="text" placeholder={this.props.data.serviceProvider ? mockData.contact_1_first_name : ""} />:
                        <div className="gmr-bluefont">{mockData.contact_1_first_name} </div>
                    }
                </div>
            </div>
            <div className="gmr-edit-header">
                <div className="gmr-fieldvalues">Last Name</div>
                <div>
                    {this.state.edit ?
                        <input name="contact_1_last_name" type="text" placeholder={this.props.data.serviceProvider ? mockData.contact_1_last_name : ""} /> :
                        <div className="gmr-bluefont">{mockData.contact_1_last_name} </div>
                    }
                </div>
            </div>
            <div className="gmr-edit-header">
                <div className="gmr-fieldvalues">Email</div>
                <div>
                    {this.state.edit? 
                        <input name="contact_1_email" type="email" placeholder={this.props.data.serviceProvider ? mockData.contact_1_email : ""} /> :
                        <div className="gmr-bluefont">{mockData.contact_1_email} </div>
                    }
                </div>
            </div>
            <div className="gmr-edit-header">
                <div className="gmr-fieldvalues">Phone</div>
                <div>
                    {
                        this.state.edit?
                        <input name="contact_1_phone" type="text" placeholder={this.props.data.serviceProvider ? mockData.contact_1_phone : ""} /> :
                        <div className="gmr-bluefont">{mockData.contact_1_phone} </div>
                    }
                </div>
            </div>
        </div>
        );
    }

    render() { 
        console.log("Current State", this.state)
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
                                <h1> {this.props.data.serviceProvider ? <span>{this.props.data.serviceProvider}</span>  : <input name="sourceName" placeholder="Source Name" /> } </h1>
                                <button type="submit" className="gmr-save-changes" onClick={this.editForm}>{!this.state.edit ? "Edit" : "Save Changes"}</button> 

                            </section>
                            <div className="row ml-5 mr-5 gmr-flex-1 p-2">
                                <section className="gmr-edit-section col-xs-12 col-sm-6"> 
                                    
                                    <h1 className="gmr-section-title-edit">Source File</h1>
                                    {/* Fields subject to change. Below is temporary */}
                                    <div className="fieldsection"> 
                                    <div className="gmr-edit-header">
                                        <div className="">Input Type</div>
                                        <div>
                                            {
                                                this.state.edit ? 
                                                <Field name="inputType" as="select" className="" value={mockData.inputType}>
                                                    {this.generateOptions(select.inputType)}
                                                </Field>
                                                :   
                                                <div className="gmr-bluefont"> {mockData.inputType} </div>
                                            }
                                            
                                        </div>
                                    </div>
                                    <div className="gmr-edit-header">
                                        <div className="">URL</div>
                                        <div>
                                            {
                                                this.state.edit ? 
                                                <input name="url" type="text" placeholder={this.props.data.url} /> :
                                                <div className="gmr-bluefont"> {mockData.url} </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">Password</div>
                                        <div>
                                            {
                                                this.state.edit ? 
                                                <input name="url" type="password" value={this.props.data.serviceProvider} /> 
                                                : <div className="gmr-bluefont"> ********* </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">File Path</div>
                                        {
                                            this.state.edit ? 
                                            <div>
                                                <input name="url" type="text" placeholder={ this.props.data.serviceProvider ? "/" + this.props.data.serviceProvider: ""} /> 
                                            </div> :
                                            <div className="gmr-bluefont">{"/"+ (this.props.data.serviceProvider || "").replace(/\s/g, '')} </div>
                                        }
                                        
                                    </div>
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">Has Revenue File</div>
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                                        
                                        </div>
                                    </div>
                                    </div>
                                </section>
                                <section className="gmr-edit-section col-xs-12 col-sm-6"> 
                                    <h1 className="gmr-section-title-edit">File Frequency</h1>
                                    <div className="fieldsection"> 
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">Delivery Frequency</div>
                                        <div>
                                            {
                                                this.state.edit ? 
                                                <Field name="deliveryFrequency" as="select" className="">
                                                    {this.generateOptions(select.deliveryFrequency)}
                                                </Field> :
                                                <div className="gmr-bluefont">{mockData.deliveryFrequency} </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">Number of Files Expected</div>
                                        <div>
                                            {
                                                this.state.edit ? 

                                            
                                                <input name="numExpectedFiles" type="number" min="0" placeholder={this.props.data.serviceProvider ? mockData.numExpectedFiles : ""} /> :
                                                <div className="gmr-bluefont">{mockData.numExpectedFiles} </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">Expected Delivery</div>
                                        <div>
                                            {this.state.edit ? 
                                            <span>
                                                <input name="expectedDelivery" type="number" min="0" placeholder={this.props.data.serviceProvider ? mockData.expectedDeliveryDays : ""} /> 
                                                
                                                <Field name="expectedDelivery" as="select" className="ml-1">
                                                    {this.generateOptions(select.expectedDelivery)}
                                                </Field>
                                            </span> :
                                            <div className="gmr-bluefont">{mockData.expectedDeliveryDays} {mockData.expectedDelivery} </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">Source Lag</div>
                                        {this.state.edit ? 
                                            <div>
                                                <Field name="sourceLag" as="select" className="">
                                                    {this.generateOptions(select.sourceLag)}
                                                </Field>
                                            </div>
                                            : <div className="gmr-bluefont">{mockData.sourceLag} </div>
                                        }
                                    </div>
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">Source Type</div>
                                        {this.state.edit?
                                            <div>
                                                <Field name="sourceType" as="select" className="">
                                                    {this.generateOptions(select.sourceType)}
                                                </Field>
                                            </div> : 
                                            <div className="gmr-bluefont">{mockData.sourceType} </div>
                                        }
                                    </div>
                                    <div className="gmr-edit-header">
                                        <div className="gmr-fieldvalues">Data Since</div>
                                        {this.state.edit ?
                                            <div>
                                                <Field name="dataSince" as="select" className="">
                                                    {this.generateOptions(select.dataSince)}
                                                </Field>
                                            
                                                <Field name="dataSinceYear" as="select" className="">
                                                    {this.generateOptions(select.dataSinceYear)}
                                                </Field>
                                            </div> :
                                            <div className="gmr-bluefont">{mockData.dataSinceQuarter} {mockData.dataSinceYear} </div>
                                        }
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
                                    </div>
                                </section>
                            </div>
                            <div className="row ml-5 mr-5 gmr-flex-1 p-2">

                            <section className="gmr-edit-section col-6">
                                <h1 className="gmr-section-title-edit">Contacts</h1>
                                <p onClick={this.addContact}> Add Contact </p>
                            </section>

                            </div>
                        </Form>
                    );
                    }}
                </Formik>
            </div>
        );
    }
}
 
export default SourcemanagerForm;