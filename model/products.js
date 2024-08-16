import { connection as db } from "../config/index.js";
import { hash } from "bcrypt";

class Products{
    fetchProducts(req,res){
            try {
              const strQry = `
                  SELECT productID, prodName, category, prodDescription, prodURL, amount
                  FROM Products;
                  `
              db.query(strQry, (err, results) => {
                if (err) throw new Error("Issue occurred while retrieving all products.");
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

    recentProducts(req, res){
      try {
        const strQry = `
            SELECT productID, prodName, category, prodDescription, prodURL, amount
            FROM Products 
            ORDER BY productID DESC
            LIMIT 5;
            `
        db.query(strQry, (err, results) => {
          if (err) throw new Error("Issue occurred while retrieving recent products.");
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
    }

    fetchProduct(req,res){
        try {
            const strQry = `
                SELECT productID, prodName, category, prodDescription, prodURL, amount
                FROM Products;
                WHERE productID = '${req.params.id}';
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

    addProduct(req, res){
      try{
        let data = req.body
        const strQry = `
        INSERT INTO Products
        SET ?;`

        db.query(strQry, [data], (err)=>{
          if(err) throw new Error('Unable to add a new product')
           res.json({
          status:res.statusCode,
          msg: 'Product was added'
        }) 
        })
      } catch (e) {
        res.json({
          status: 404,
          msg: e.message,
        });
      }
    }


     updateProduct(req,res){
        try {
            let data = req.body;
            const strQry = `
                UPDATE Products SET ? WHERE productID = '${req.params.id}';
                `;
            db.query(strQry, [data], (err) => {
              if (err) throw new Error("Unable to update product");
              res.json({
                status: res.statusCode,
                msg: "The product was updated",
              });
            });
          } catch (e) {
            res.json({
              status: 404,
              msg: e.message,
            });
          }
    }

    deleteProduct(req,res){
        try {
            const strQry = `
                DELETE FROM Products WHERE productID = '${req.params.id}';`;
        
            db.query(strQry, (err) => {
              if (err)
                throw new Error("To delete a product, please review your delete query");
              res.json({
                status: res.statusCode,
                msg: "The product has been removed",
              });
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
    Products
}