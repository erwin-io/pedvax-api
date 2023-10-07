/** source/controllers/posts.ts */
import { Router, Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
import { Vaccine } from "../db/entities/Vaccine";
import { getManager, getRepository } from "typeorm";
import FileMiddleware from "../middleware/file-middleware";

export const vaccineRouter = Router();


vaccineRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    let vaccines: Vaccine[] = await getRepository(Vaccine).find({
      where: {
        active: true
      }
    });
    return res.status(200).json({
      data: vaccines,
    });
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

vaccineRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    let vaccine: Vaccine = await getRepository(Vaccine).findOne({
      where: {
        vaccineId: id,
        active: true
      },
    });
    return res.status(200).json({
      message: vaccine,
    });
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

vaccineRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body && req.body.name) {
      const { name } = req.body;
      let vaccine = new Vaccine();
      vaccine.name = name;
      vaccine = await getManager().transaction(
        async (transactionalEntityManager) => {
          return await transactionalEntityManager.save(vaccine);
        },
      );
      return res.status(200).json({
        data: vaccine,
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

vaccineRouter.put("/:id", async (req: Request,res: Response,next: NextFunction,) => {

  try {
    if (req.body && req.body.name && req.params && req.params.id) {
      let { name, id } = { ...req.body as any, ...req.params as any } as any;
      let vaccine: Vaccine = await getRepository(Vaccine).findOne({
        where: {
          vaccineId: id,
          active: true
        },
      });
      if(vaccine) {
        vaccine.name = name;
        vaccine = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(vaccine);
          },
        );
        return res.status(200).json({
          message: "vaccine updated successfully",
          data: vaccine,
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

vaccineRouter.delete("/:id", async ( req: Request, res: Response, next: NextFunction,) => {
  try {
    if (req.params && req.params.id) {
      let { id } = req.params;
      let vaccine: Vaccine = await getRepository(Vaccine).findOne({
        where: {
          vaccineId: id,
          active: true
        },
      });
      
      if(vaccine) {
        vaccine.active = false;
        vaccine = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(vaccine);
          },
        );
        return res.status(200).json({
          message: "vaccine deleted successfully",
          data: vaccine,
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
