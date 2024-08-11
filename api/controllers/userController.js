const bcrypt = require('bcrypt');
const User = require('../models/user');
require('dotenv').config();

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const data = {
            username,
            email,
            password: await bcrypt.hash(password, 10),
        };

        const user = await User.create(data);

        if (user) {
            return res.status(201).send(user);
        } else {
            return res.status(409).send("Details are not correct");
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Serveur Error')
    }
};

const login = async (req, res) => {
    try {
        const { email, password} = req.body;
        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (user) {
            const isSame = await bcrypt.compare(password, user.password);

            if (isSame) {
            
                req.session.userId = user.id;
                req.session.username = user.username;
                req.session.email = user.email;
                res.status(200).json({authenticated: true, username: req.session.username, message:`Connexion réussie bienvenue ${req.session.username}`});

            } else {
                return res.status(401).send("Authentification failed");
            }
        } else {
            return res.status(401).send("Authentification failed");
        }
    } catch (error) {
        return res.status(500).send('Erreur Interne, veuillez re-essayer');

    }
};

const logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Erreur lors de la déconnexion');
        }
        res.clearCookie('connect.sid', {
            path: '/', // Assurez-vous que le chemin correspond à celui utilisé pour définir le cookie
            domain: 'localhost', // Assurez-vous que le domaine correspond
            httpOnly: true, // Le cookie HttpOnly sera supprimé par le serveur
            secure: false, // Assurez-vous que 'secure' correspond à la configuration utilisée
            sameSite: 'Strict',
        });
        res.status(200).json({message: 'Déconnexion réussie'});
    });
};


const getUserName = async (req, res) => {
    return res.status(200).json({username: req.session.username});
}

const getUserProfil = async (req, res) => {
    return res.status(200).json({user: req.session.username, email: req.session.email})
}

const changePassword = async (req, res) => {
    const {oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ errorMessage: 'Veuillez fournir toutes les informations demandées.'})
    }
    try {

        const user = await User.findOne({ where: {id: req.session.userId}}); 

        if (!user) {
            return res.status(404).json({ errorMessage: 'Utilisateur introuvable.'});
        }

        if (user) {
            const isSame = await bcrypt.compare(oldPassword, user.password);

            if (isSame) {
                const hashedNewPassword = await bcrypt.hash(newPassword, 10);
                user.password = hashedNewPassword;
                await user.save();
                return res.status(200).json({successMessage: 'Mot de passe mis à jour avec succès'});
            }
            if (!isSame) {
                return res.status(400).json({errorMessage: 'Ancien mot de passe incorrect.'});
            }
        }
    } catch (error) {
        return res.status(500).json({ errorMessage: 'Erreur lors de la mise à jour du mot de passe.'})
    };
}

const changeUsername = async (req, res) => {
    const {newUsername} = req.body;
    try {
        const isUsernameTaken = await User.findOne( {
            where: {
                username: newUsername
            }
       });
       
       if (isUsernameTaken) {
        return res.status(400).json({errorMessage: 'Ce username est déjà pris, veuillez en choisir un autre.'})
       }

       if (!isUsernameTaken) {
        try {
            const user = await User.findOne( {
                where : {
                    id: req.session.userId
                }
            });

            if (user) {
                 user.username = newUsername;
                 await user.save();
                 req.session.username = newUsername
                return res.status(200).json({successMessage: 'Votre username a été changé avec succès.'})
            }

        } catch (error) {
            return res.status(500).json({errorMessage:'Une erreur est survenue veuillez réessayer.'});
       };

       }
    } catch (error) {
        return res.status(500).json({errorMessage: 'Une erreur est survenue, veuillez réessayer.'})
    }

}

const changeEmail = async (req, res) => {
    const {newEmail} = req.body;
    try {
        const isEmailTaken = await User.findOne( {
            where: {
                email: newEmail
            }
       });
       
       if (isEmailTaken) {
        return res.status(400).json({errorMessage: 'Cet email est déjà pris, veuillez en choisir un autre.'})
       }

       if (!isEmailTaken) {
        try {
            const user = await User.findOne( {
                where : {
                    id: req.session.userId
                }
            });

            if (user) {
                 user.email = newEmail;
                 await user.save();
                 req.session.email = newEmail
                return res.status(200).json({successMessage: 'Votre email a été changé avec succès.'})
            }

        } catch (error) {
            return res.status(500).json({errorMessage:'Une erreur est survenue veuillez réessayer.'});
       };

       }
    } catch (error) {
        return res.status(500).json({errorMessage: 'Une erreur est survenue, veuillez réessayer.'})
    }
}



module.exports = {
    signup,
    login,
    logout,
    getUserName,
    getUserProfil,
    changePassword,
    changeUsername,
    changeEmail,
    
};