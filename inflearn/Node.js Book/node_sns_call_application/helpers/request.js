const axios = require('axios');

module.exports = async (req, api) => {
    try {
        if (!req.session.jwt) {
            const tokenResult = await axios.post(
                `http://localhost:8081/${process.envAPI_VERSION}/token`,
                { clientSecret: process.env.CLIENT_SECRET }
            );

            req.session.jwt = tokenResult.data.token;
        }

        return await axios.get(
            `http://localhost:8081/${process.env.API_VERSION}/${api}`,
            {
                headers: {
                    Authorization: req.session.jwt,
                },
            }
        );
    } catch (err) {
        console.error(err);
        if (err.response.status < 500) {
            return err.response;
        }
        throw err;
    }
};
