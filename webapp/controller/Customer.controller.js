sap.ui.define(
    [
        "clouddna/walkthrough/clouddnaui5/controller/BaseController",
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox",
        "sap/ui/model/json/JSONModel",
        "sap/ui/core/Fragment",
        "sap/ui/core/routing/History",
        "clouddna/walkthrough/clouddnaui5/controller/formatter/HOUI5Formatter"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
        BaseController,
        Controller,
        MessageBox,
        JSONModel,
        Fragment,
        History,
        HOUI5Formatter
    ) {
        "use strict";

        return BaseController.extend(
            "clouddna.walkthrough.clouddnaui5.controller.Customer",
            {
                formatter: HOUI5Formatter,
                _fragmentList: {},
                onInit: function () {
                    this.setContentDensity();

                    let oEditModel = new JSONModel({
                        editMode: false
                    });

                    this.getView().setModel(oEditModel, "editModel");

                    this._showCustomerFragment("DisplayCustomer");

                    // let oRouter = this.getOwnerComponent().getRouter();

                    this.getRouter()
                        .getRoute("Customer")
                        .attachPatternMatched(this._onPatternMatched, this);
                },
                _onPatternMatched: function (oEvent) {
                    let sPath = oEvent.getParameters().arguments.path;
                    this.sCustomerPath = "/customers/" + sPath;
                    this.getView().bindElement(this.sCustomerPath);
                    console.log(sPath, "sCustomerPath");
                },

                onNavBack: function () {
                    var oHistory = History.getInstance();
                    var sPreviousHash = oHistory.getPreviousHash();

                    if (sPreviousHash !== undefined) {
                        window.history.go(-1);
                    } else {
                        var oRouter = this.getOwnerComponent().getRouter();
                        oRouter.navTo("Main");
                    }
                },
                _showCustomerFragment: function (sFragmentName) {
                    let oPage = this.getView().byId("page");

                    console.log(oPage, "oPage");

                    oPage.removeAllContent();

                    if (this._fragmentList[sFragmentName]) {
                        oPage.insertContent(this._fragmentList[sFragmentName]);
                    } else {
                        Fragment.load({
                            id: this.getView().createId(sFragmentName),
                            name:
                                "clouddna.walkthrough.clouddnaui5.view.fragment." +
                                sFragmentName,
                            controller: this
                        }).then(
                            function (oFragment) {
                                this._fragmentList[sFragmentName] = oFragment;
                                oPage.insertContent(
                                    this._fragmentList[sFragmentName]
                                );
                            }.bind(this)
                        );
                    }
                },
                _toggleEdit: function (bEditMode) {
                    let oEditModel = this.getView().getModel("editModel");

                    oEditModel.setProperty("/editmode", bEditMode);

                    this._showCustomerFragment(
                        bEditMode ? "ChangeCustomer" : "DisplayCustomer"
                    );
                },

                onEditPressed: function () {
                    this._toggleEdit(true);
                },

                onCancelPressed: function () {
                    this._toggleEdit(false);
                },

                onSavePressed: function () {
                    const oModel = this.getView().getModel();
                    const oData = oModel.getData();
                    MessageBox.success(JSON.stringify(oData));

                    this._toggleEdit(false);
                }
            }
        );
    }
);
