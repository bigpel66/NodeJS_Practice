const axios = require('axios');

module.exports = async (req, api) => {
    try {
        if (!req.session.jwt) {
            const tokenResult = await axios.post(
                `${process.env.URL}/${process.env.API_VERSION}/token`,
                { serverSecret: process.env.SERVER_SECRET }
            );

            req.session.jwt = tokenResult.data.token;
        }

        return await axios.get(
            `${process.env.URL}/${process.env.API_VERSION}/${api}`,
            {
                headers: {
                    Authorization: req.session.jwt,
                },
            }
        );
    } catch (err) {
        console.error(err);
        if (err.response.status < 500) {
            delete req.session.jwt;
            this(req, api);
            return err.response;
        }
        throw err;
    }
};
