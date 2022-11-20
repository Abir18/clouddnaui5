sap.ui.define(
    [
        "clouddna/walkthrough/clouddnaui5/controller/BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/ui/core/Fragment",
        "clouddna/walkthrough/clouddnaui5/controller/formatter/HOUI5Formatter",
        "sap/ui/dom/jquery/getSelectedText"
    ],
    function (BaseController, JSONModel, Fragment, HOUI5Formatter) {
        "use strict";

        return BaseController.extend(
            "clouddna.walkthrough.clouddnaui5.controller.Main",
            {
                /**
                 * @override
                 */
                onInit: function () {
                    this.setContentDensity();
                },

                onListItemPressed: function (oEvent) {
                    let sPath = oEvent
                        .getSource()
                        .getBindingContext()
                        .getPath();
                    console.log(sPath);
                    // let oRouter = this.getOwnerComponent().getRouter();
                    let oRouter = this.getRouter();
                    oRouter.navTo("Customer", {
                        path: sPath.split("/")[2]
                    });
                },

                _fragmentList: {},

                formatter: HOUI5Formatter,

                _showCustomerFragment: function (sFragmentName) {
                    let oPage = this.getView().byId("page");

                    // oPage.removeAllContent();

                    Fragment.load({
                        name:
                            "clouddna.walkthrough.clouddnaui5.view.fragment." +
                            sFragmentName,
                        controller: this
                    }).then((oFragment) => {
                        this._fragmentList[sFragmentName] = oFragment;
                        oPage.insertContent(this._fragmentList[sFragmentName]);
                    });
                },

                onCreatePressed: function () {
                    this._showCustomerFragment("CreateCustomer");

                    console.log(this.getModel().getData());
                },

                onCreateCustomer: function () {
                    const customerid = sap.ui
                        .getCore()
                        .byId("create_input_customerid")
                        .getValue();
                    const firstname = sap.ui
                        .getCore()
                        .byId("create_input_firstname")
                        .getValue();
                    const lastname = sap.ui
                        .getCore()
                        .byId("create_input_lastname")
                        .getValue();
                    const title = sap.ui
                        .getCore()
                        .byId("create_input_title")
                        .getValue();
                    const gender = sap.ui
                        .getCore()
                        .byId("create_select_gender")
                        .getSelectedItem()
                        .getText();
                    const email = sap.ui
                        .getCore()
                        .byId("create_input_email")
                        .getValue();
                    const phone = sap.ui
                        .getCore()
                        .byId("create_input_phone")
                        .getValue();
                    const website = sap.ui
                        .getCore()
                        .byId("create_input_website")
                        .getValue();

                    // console.log(gender, "gender");

                    const newCustomer = {
                        customerid,
                        firstname,
                        lastname,
                        title,
                        gender,
                        email,
                        phone,
                        website
                    };

                    let data = this.getView().getModel().getData();

                    let newData = data.customers;

                    newData.push(newCustomer);

                    let newCustomers = new JSONModel({ customers: newData });

                    this.getView().setModel(newCustomers);

                    // console.log(newCustomer);

                    // let oRouter = this.getRouter();
                    // oRouter.navTo("Main");

                    // window.history.go(-1);
                },

                onDeleteButtonPressed: function (id) {
                    let oData = this.getView().getModel().getData();
                    console.log(oData, "oData");

                    let customersData = oData.customers;

                    let filteredCustomers = customersData.filter(
                        (customer) => customer.customerid !== id
                    );

                    let newData = new JSONModel({
                        customers: filteredCustomers
                    });

                    console.log(newData.getData(), "newData");
                    this.setModel(newData);

                    let data = this.getView().getModel().getData();
                    console.log(data, "data");

                    this.getModel().refresh();
                }
            }
        );
    }
);
