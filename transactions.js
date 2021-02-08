var { executeQuery } = require("./db");
var { ACCOUNT_TYPES, BASIC_SAVINGS_BALANCE_LIMIT } = require("./constants");
const { writer } = require("repl");


async function doTransaction(req, res) {
    try {

        console.log("req params", req.body)
        const { fromAccountId, toAccountId, amount } = req.body;
        const sourceAccount = await fetchAccountDetails(fromAccountId);
        console.log("sourceAccount", sourceAccount)
        if (!sourceAccount) {
            res.send({
                errorCode: 404,
                errorMessasge: "Invalid source account number"
            })
            return;
        }
        if (sourceAccount.balance < amount) {
            res.send({
                errorCode: 403,
                errorMessasge: "Insufficient balance in Account"
            })
            return;
        }
        const destAccount = await fetchAccountDetails(toAccountId);
        console.log("destAccount", destAccount)
        if (!destAccount) {
            res.send({
                errorCode: 404,
                errorMessasge: "Invalid destination account number"
            })
            return;
        }
        if (destAccount.customer_id === sourceAccount.customer_id) {
            res.send({
                errorCode: 401,
                errorMessasge: "Transfer to own account is not allowed"
            })
            return;
        }
        if (destAccount.type === ACCOUNT_TYPES.BasicSavings &&
            (destAccount.balance + amount) > BASIC_SAVINGS_BALANCE_LIMIT) {
            res.send({
                errorCode: 404,
                errorMessasge: "Account balance in destination account exceeds Maximum allowed balance"
            })
            return;
        }

        const success = performTransaction(fromAccountId, toAccountId, amount, sourceAccount, destAccount);

        res.send("Success");
    } catch (error) {
        console.log("Error in Transaction")
        res.send({
            errorCode: 500,
            errorMessasge: "Error occured while performing transaction, Please try again..."
        })
    }
}

async function fetchAccountDetails(accountNumber) {
    try {
        const query = "select * from Account where number='" + accountNumber + "'";
        console.log("fetchAccountDetails query", query)
        const result = await executeQuery(query);
        console.log("fetchAccountDetails result", result)
        if (result) {
            if (result.length === 0) {
                return null;
            } else {
                return result[0];
            }
        } else {
            return null;
        }
    }
    catch (error) {
        console.log("Error fetching account details", error)
        throw error;
    }
}

async function performTransaction(fromAccountId, toAccountId, amount, sourceAccount, destAccount) {
}

module.exports = {
    doTransaction,
}