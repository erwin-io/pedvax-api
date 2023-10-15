/** source/controllers/posts.ts */
import { Router, Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
import { Users } from "../db/entities/Users";
import { getManager, getRepository } from "typeorm";
import { AESDecrypt, AESEncrypt } from "../utils/utils";

export const usersRouter = Router();


usersRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    let users: Users[] = await getRepository(Users).find({
      where: {
        active: true
      }
    });
    return res.status(200).json({
      data: users.map(x=> {
        delete x.password;
        return x;
      }),
      success: true
    });
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

usersRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    let user: Users = await getRepository(Users).findOne({
      where: {
        userId: id,
        active: true
      },
    });
    if(user) {
      delete user.password;
      return res.status(200).json({
        data: user,
        success: true
      });
    } else {
      return res.status(404).json({
        message: "Not found!",
      });
    }
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

usersRouter.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body && 
        req.body.mobileNumber && 
        req.body.password) {
      const { mobileNumber, password } = req.body;
      let user: Users = await getRepository(Users).findOne({
        where: {
          mobileNumber,
          active: true
        },
      });
      if(user && password === await AESDecrypt(user.password)) {
        delete user.password;
        return res.status(200).json({
          data: user,
          success: true
        });
      } else {
        return res.status(404).json({
          message: "Not found!",
        });
      }
    } else {
      return res.status(404).json({
        message: "Bad Request!",
      });
    }
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

usersRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body && 
        req.body.name && 
        req.body.mobileNumber && 
        req.body.password && 
        req.body.userType &&
        ( 
            req.body.userType.toString().toUpperCase().includes("ADMIN") || 
            req.body.userType.toString().toUpperCase().includes("RHU") || 
            req.body.userType.toString().toUpperCase().includes("BHW")
        )) {
      const { name, mobileNumber, password, userType } = req.body;
      let user = new Users();
      user.name = name;
      user.mobileNumber = mobileNumber;
      user.password = await AESEncrypt(password);
      user.userType = userType.toString().toUpperCase();
      user = await getManager().transaction(
        async (transactionalEntityManager) => {
          return await transactionalEntityManager.save(user);
        },
      );
      delete user.password;
      return res.status(200).json({
        data: user,
        success: true
      });
    } else {
      return res.status(404).json({
        message: "Bad Request!",
      });
    }
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

usersRouter.put("/:id", async (req: Request,res: Response,next: NextFunction,) => {

  try {
    if (req.params && 
        req.params.id && 
        req.body && 
        req.body.name) {
      let { name, id } = { ...req.body as any, ...req.params as any } as any;
      let user: Users = await getRepository(Users).findOne({
        where: {
          userId: id,
          active: true
        },
      });
      if(user) {
        user.name = name;
        user = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(user);
          },
        );
        delete user.password;
        return res.status(200).json({
          message: "user updated successfully",
          data: user,
          success: true
        });
      } else {
        return res.status(404).json({
            message: "Not Found!",
        });
      }
    } else {
      return res.status(400).json({
        message: "Bad request!",
      });
    }
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

usersRouter.put("/:id/changePassword", async (req: Request,res: Response,next: NextFunction,) => {

  try {
    if (req.params && 
        req.params.id && 
        req.body && 
        req.body.password) {
      let { password, id } = { ...req.body as any, ...req.params as any } as any;
      let user: Users = await getRepository(Users).findOne({
        where: {
          userId: id,
          active: true
        },
      });
      if(user) {
        user.password = await AESEncrypt(password);
        user = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(user);
          },
        );
        delete user.password;
        return res.status(200).json({
          message: "user updated successfully",
          data: user,
          success: true
        });
      } else {
        return res.status(404).json({
            message: "Not Found!",
        });
      }
    } else {
      return res.status(400).json({
        message: "Bad request!",
      });
    }
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

usersRouter.delete("/:id", async ( req: Request, res: Response, next: NextFunction,) => {
  try {
    if (req.params && req.params.id) {
      let { id } = req.params;
      let user: Users = await getRepository(Users).findOne({
        where: {
          userId: id,
          active: true
        },
      });
      
      if(user) {
        delete user.password;
        user.active = false;
        user = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(user);
          },
        );
        return res.status(200).json({
          message: "user deleted successfully",
          data: user,
          success: true
        });
      } else {
        return res.status(404).json({
          message: "Not Found!",
        });
      }
    } else {
      return res.status(400).json({
        message: "Bad request!",
      });
    }
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});
