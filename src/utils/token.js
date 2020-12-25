import jwt from "jsonwebtoken";
// import { config as envConfig } from "dotenv";

const JWT_SECRET =
  process.env.NODE_ENV === "local" || process.env.NODE_ENV === "development"
    ? "fake_secret"
: process.env.JWT_SECRET;


export function generateToken(id) {
  return new Promise((resolve, reject) => {
    jwt.sign({ id }, JWT_SECRET, { expiresIn: "7 days" }, (err, token) => {
      if (err) {
        return reject(err);
      };
      resolve(token);
    });
  });
};


export function decodeToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
        return;
      };
      resolve(decoded);
    });
  });
}
