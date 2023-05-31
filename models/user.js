export default  (sequelize,DataTypes) => {
    return  sequelize.define('user', {
        name: {
            type: DataTypes.STRING,
            allowNull:false,
            validate:{
                notNull: {
                    msg: "Name is required"
                },
                notEmpty: {
                    msg: "Name is required"
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "Email already exist. Please try with another email!."
            },
            validate:{
                notNull: {
                    msg: "Email is required"
                },
                notEmpty: {
                    msg: "Email is required"
                },
                isEmail: {
                    msg: "Enter valid Mail"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notNull: {
                    msg: "Password is required"
                },
                notEmpty: {
                    msg: "Password is required"
                }
            }
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
}