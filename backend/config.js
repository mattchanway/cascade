const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

require("dotenv").config();

function getDatabaseUri(){
    return (process.env.NODE_ENV === "test") ? "cascade-test" : process.env.DATABASE_URL || "cascade";

}

module.exports = {

    SECRET_KEY,
    getDatabaseUri
};