const logins = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Admin email and password verification
        // Inga unga verification logic write pannanum

        res.redirect('/admin/dashboard');

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
module.exports={logins}