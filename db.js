const mongodb = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

mongodb.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    module.exports = client; //returns the db client, (the whole db)

    //start the express app
    const app = require("./app");
    app.listen(process.env.PORT, ()=>console.log(`app is now listening on ${process.env.PORT}`));
});