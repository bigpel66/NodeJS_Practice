module.exports.get404 = (request, response, next) => {
    response
        .status(404)
        .render("404", { path: "", pageTitle: "Page Not Found" });
};
