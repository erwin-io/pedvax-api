/** source/controllers/posts.ts */
import { Router, Request, Response, NextFunction } from "express";
import { HealthCenter } from "../db/entities/HealthCenter";
import { getManager, getRepository } from "typeorm";

export const healthCenterRouter = Router();


healthCenterRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    let healthCenters: HealthCenter[] = await getRepository(HealthCenter).find({
      where: {
        active: true
      }
    });
    return res.status(200).json({
      data: healthCenters,
    });
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

healthCenterRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    let healthCenter: HealthCenter = await getRepository(HealthCenter).findOne({
      where: {
        healthCenterId: id,
        active: true
      },
    });
    return res.status(200).json({
      message: healthCenter,
    });
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

healthCenterRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body && 
        req.body.name && 
        req.body.mapLocationX && 
        req.body.mapLocationY) {
      const { name, mapLocationX, mapLocationY } = req.body;
      let healthCenter = new HealthCenter();
      healthCenter.name = name;
      healthCenter.mapLocationX = mapLocationX;
      healthCenter.mapLocationY = mapLocationY;
      healthCenter = await getManager().transaction(
        async (transactionalEntityManager) => {
          return await transactionalEntityManager.save(healthCenter);
        },
      );
      return res.status(200).json({
        data: healthCenter,
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

healthCenterRouter.put("/:id", async (req: Request,res: Response,next: NextFunction,) => {

  try {
    if (req.body && req.body.name && req.params && req.params.id) {
      let { name, id } = { ...req.body as any, ...req.params as any } as any;
      let healthCenter: HealthCenter = await getRepository(HealthCenter).findOne({
        where: {
          healthCenterId: id,
          active: true
        },
      });
      if(healthCenter) {
        healthCenter.name = name;
        healthCenter = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(healthCenter);
          },
        );
        return res.status(200).json({
          message: "Health Center updated successfully",
          data: healthCenter,
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

healthCenterRouter.delete("/:id", async ( req: Request, res: Response, next: NextFunction,) => {
  try {
    if (req.params && req.params.id) {
      let { id } = req.params;
      let healthCenter: HealthCenter = await getRepository(HealthCenter).findOne({
        where: {
          healthCenterId: id,
          active: true
        },
      });
      
      if(healthCenter) {
        healthCenter.active = false;
        healthCenter = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(healthCenter);
          },
        );
        return res.status(200).json({
          message: "Health Center deleted successfully",
          data: healthCenter,
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
