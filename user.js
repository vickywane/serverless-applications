require("dotenv").config()
const cors = require("cors")({origin : true});


exports.userFunctions = (req, res) =>  {
    const {type} = req.body 

    return cors(req, res, () => {
        switch () { 
            case "GET-DATA" :
                break;
            case "INSERT-DATA" :
                break;
            case "UPDATE-DATA": 
                break;
            case "DELETE-DATA" : 
                break;
            default : 
                res.status(422).send(`No action available for ${type} action type`)
        }
    })
}



