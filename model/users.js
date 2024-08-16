import { connection as db } from "../config/index.js";
import { createToken } from "../middleware/Authenticate.js";
import { compare, hash } from "bcrypt";

class Users{
    fetchUsers(req,res){
        try {
          const strQry = `
              SELECT firstName, lastName, age, emailAdd, userRole, profileURL
              FROM Users;
              `
          db.query(strQry, (err, results) => {
            if (err) throw new Error("Issue when retrieving all users.");
            res.json({
              status: res.statusCode,
              results,
            });
          });
        } catch (e) {
          res.json({
            status: 404,
            msg: e.message,
          });
        }
      };
    
    fetchUser(req,res){
        try {
            const strQry = `
                SELECT userID, firstName, lastName, age, emailAdd, userRole, profileURL
                FROM Users
                WHERE userID = '${req.params.id}';
                `;
            db.query(strQry, (err, result) => {
              if (err) throw new Error("Issue when retrieving a user.");
              res.json({
                status: res.statusCode,
                result: result[0],
              });
            });
          } catch (e) {
            res.json({
              status: 404,
              msg: e.message,
            });
          }
}

    async registerUser(req,res){
        try {
            let data = req.body;
            data.password = await hash(data.password, 12);
            // payload
            let user = {
              emailAdd: data.emailAdd,
              password: data.password,
            };
            let reqQuery = `
                INSERT INTO Users SET ?;
                `;
            db.query(reqQuery, [data], (err) => {
              if (err) {
                res.json({
                  status: res,
                  statusCode,
                  msg: "This email already exists",
                });
              } else {
                const token = createToken(user);
                res.json({
                  token,
                  msg: "You are registered",
                });
              }
            });
          } catch (e) {}
    }

    async updateUser(req,res){
        try {
            let data = req.body;
            if (data.pwd) {
              data.pwd = await hash(data.pwd, 12);
            }
            const strQry = `
                UPDATE Users SET ? WHERE userID = '${req.params.id}';
                `;
            db.query(strQry, [data], (err) => {
              if (err) throw new Error("Unable to update a user");
              res.json({
                status: res.statusCode,
                msg: "The user record was updated",
              });
            });
          } catch (e) {
            res.json({
              status: 404,
              msg: e.message,
            });
          }
    }

    deleteUser(req,res){
        try {
            const strQry = `
                DELETE FROM Users WHERE userID = '${req.params.id}';`;
        
            db.query(strQry, (err) => {
              if (err)
                throw new Error("To delete a user, please review your delete query");
              res.json({
                status: res.statusCode,
                msg: "A user/s information was removed",
              });
            });
          } catch (e) {
            res.json({
              status: 404,
              msg: e.message,
            });
          }
    }

    async login(req,res){
        try {
            const { emailAdd, password } = req.body;
            const strQry = `
                SELECT userID, firstName, lastName, age, emailAdd, password, userRole, profileURL FROM Users WHERE emailAdd = '${emailAdd}';`;
        
            db.query(strQry, async (err, results) => {
              if (err) throw new Error("To login, please review your query");
              if (!results?.length) {
                res.json({
                  status: 401,
                  msg: "You provided the wrong email.",
                });
              } else {
                const isValidPass = await compare(password, results[0].password);
                if (isValidPass) {
                  const token = createToken({
                    emailAdd,
                    password,
                  });
                  res.json({
                    status: res.statusCode,
                    token,
                    result: results[0],
                  });
                } else {
                  res.json({
                    status: 401,
                    msg: "Invalid password or you have not registered",
                  });
                }
              }
            });
          } catch (e) {
            res.json({
              status: 404,
              msg: e.message,
            });
          }
    }
} 
export {
    Users
}