const addCustomer = Customer => async (customer) => {
    const newCustomer = new Customer(customer)
    try {
        const save = await newCustomer.save();
        console.log(save);
        if (save) {
            return ({
                status: "success",
                message: "Customer added successfully",
                payload: save
            })
        }
    } catch (error) {
        return ({
            status: "error",
            message: "Unable to add new Customer",
            payload: error
        })
    }

}

const getAllCustomers = Customer => async () => {
    try {
        let customers = await Customer.find({});
        if (customers) {
            return ({
                status: "success",
                message: "Get All Customers",
                payload: customers
            })
        }
    } catch (error) {
        return ({
            status: "error",
            message: "Unable to get all Customers",
            payload: error
        })
    }
}

const getCustomerById = Customer => async (id) => {
    if (id === undefined) {
        return ({
            status: "error",
            message: `Cant't get a customer without id`,
            payload: null
        })
    } else {
        try {
            let customer = await Customer.findById(id);
            if (customer) {
                return ({
                    status: "success",
                    message: "success to get a customer",
                    payload: customer
                })
            }
        } catch (error) {
            return ({
                status: "error",
                message: "Unable to get the customer",
                payload: error
            })
        }
    }
}

const updateCustomer = Customer => async (id, customer) => {
    if (id === undefined || customer === undefined || JSON.stringify(customer) === "{}") {
        return ({
            status: "error",
            message: "Unable to update customer",
            payload: null
        })
    }
    try {
        let updatedCustomer = await Customer.findByIdAndUpdate(id, customer);
        if (updatedCustomer) {
            return ({
                status: "success",
                message: "Customer updated successfully",
                payload: await Customer.findById(id)
            });
        }
    } catch (error) {
        return ({
            status: "error",
            message: "Update Customer is failed",
            payload: error
        })
    }
}

const removeCustomer = Customer => async (id) => {
    if(id === undefined){
        return ({
            status: "error",
            message: "Unable to remove customer",
            payload: null
        })
    }else{
        try {
            let customer=await Customer.deleteOne({_id:id});
            if(customer){
                return ({
                    status: "success",
                    message: `Customer removed successfully`,
                    payload: customer
                });
            }

            
        } catch (error) {
            return ({
                status: "error",
                message: "Removing Customer is failed",
                payload: error
            }) 
        }
    }
}



module.exports = (Customer) => {
    return {
        addCustomer: addCustomer(Customer),
        getAllCustomers: getAllCustomers(Customer),
        getCustomerById: getCustomerById(Customer),
        updateCustomer: updateCustomer(Customer),
        removeCustomer: removeCustomer(Customer),
    }
}