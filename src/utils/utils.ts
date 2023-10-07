/* eslint-disable @typescript-eslint/no-var-requires */
import { getConnectionOptions, getConnection } from "typeorm";
import * as bcrypt from "bcrypt";
import { createCipheriv, randomBytes, scrypt } from "crypto";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";

export const round = (number) => {
  return Math.round((number + Number.EPSILON) * 100);
};

export const AESEncrypt = async (value) => {
  // crypto module
  const crypto = require("crypto");

  const algorithm = "aes-256-cbc";

  // generate 16 bytes of data
  const initVector = crypto
    .createHash("sha512")
    .update(
      fs.readFileSync(path.join(__dirname, "./../../private.key"))
    )
    .digest("hex")
    .substring(0, 16);

  // secret key generate 32 bytes of data
  const Securitykey = crypto
    .createHash("sha512")
    .update(
      fs.readFileSync(path.join(__dirname, "./../../private.key"))
    )
    .digest("hex")
    .substring(0, 32);

  // the cipher function
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
  return Buffer.from(
    cipher.update(value, "utf8", "hex") + cipher.final("hex")
  ).toString("base64"); // Encrypts data and converts to hex and base64
};

export const AESDecrypt = async (value) => {
  // crypto module
  const crypto = require("crypto");

  const algorithm = "aes-256-cbc";

  // generate 16 bytes of data
  const initVector = crypto
    .createHash("sha512")
    .update(
      fs.readFileSync(path.join(__dirname, "./../../private.key"))
    )
    .digest("hex")
    .substring(0, 16);

  // secret key generate 32 bytes of data
  const Securitykey = crypto
    .createHash("sha512")
    .update(
      fs.readFileSync(path.join(__dirname, "./../../private.key"))
    )
    .digest("hex")
    .substring(0, 32);

  const buff = Buffer.from(value, "base64");
  const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
  return (
    decipher.update(buff.toString("utf8"), "hex", "utf8") +
    decipher.final("utf8")
  ); // Decrypts data and converts to utf8
};
