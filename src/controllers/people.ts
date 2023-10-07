/** source/controllers/posts.ts */
import { Router, Request, Response, NextFunction } from "express";
import { People } from "../db/entities/People";
import { getManager, getRepository } from "typeorm";
import { HealthCenter } from "../db/entities/HealthCenter";

export const peopleRouter = Router();


peopleRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    let peoples: People[] = await getRepository(People).find({
      where: {
        active: true
      },
      relations: {
        healthCenter: true,
      }
    });
    return res.status(200).json({
      data: peoples,
    });
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

peopleRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    let people: People = await getRepository(People).findOne({
      where: {
        peopleId: id,
        active: true
      },
      relations: {
        healthCenter: true,
      }
    });
    return res.status(200).json({
      message: people,
    });
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

peopleRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body && 
        req.body.name &&
        req.body.gender &&
        (req.body.gender === "MALE" || req.body.gender === "FEMALE" || req.body.gender === "OTHERS") &&
        req.body.birthDate &&
        req.body.address &&
        req.body.guardian &&
        req.body.healthCenterId) {
      const { name, gender, birthDate, address, guardian, healthCenterId } = req.body;
      let people = new People();
      people.name = name;
      people.gender = gender.toUpperCase();
      people.birthDate = birthDate;
      people.address = address;
      people.guardian = guardian;

      const healthCenter = await getRepository(HealthCenter).findOne({
        where: {
          healthCenterId,
          active: true
        }
      });
      if(!healthCenter) {
        return res.status(404).json({
          message: "Bad Request!",
        });
      }
      people.healthCenter = healthCenter;

      people = await getManager().transaction(
        async (transactionalEntityManager) => {
          return await transactionalEntityManager.save(people);
        },
      );
      return res.status(200).json({
        data: people,
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

peopleRouter.put("/:id", async (req: Request,res: Response,next: NextFunction,) => {

  try {
    if (req.params && 
        req.params.id &&
        req.body && 
        req.body.name &&
        req.body.gender &&
        (req.body.gender === "MALE" || req.body.gender === "FEMALE" || req.body.gender === "OTHERS") &&
        req.body.birthDate &&
        req.body.address &&
        req.body.guardian &&
        req.body.healthCenterId) {
      const { id } = req.params;
      const { name, gender, birthDate, address, guardian, healthCenterId } = req.body;
      let people: People = await getRepository(People).findOne({
        where: {
          peopleId: id,
          active: true
        },
        relations: {
          healthCenter: true
        }
      });
      if(people) {
        people.name = name;
        people.gender = gender.toUpperCase();
        people.birthDate = birthDate;
        people.address = address;
        people.guardian = guardian;

        if(healthCenterId !== people.healthCenter.healthCenterId) {
          const healthCenter = await getRepository(HealthCenter).findOne({
            where: {
              healthCenterId,
              active: true
            }
          });
          if(!healthCenter) {
            return res.status(404).json({
              message: "Bad Request!",
            });
          }
          people.healthCenter = healthCenter;
        }

        people = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(people);
          },
        );
        return res.status(200).json({
          message: "people updated successfully",
          data: people,
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

peopleRouter.delete("/:id", async ( req: Request, res: Response, next: NextFunction,) => {
  try {
    if (req.params && req.params.id) {
      let { id } = req.params;
      let people: People = await getRepository(People).findOne({
        where: {
          peopleId: id,
          active: true
        },
      });
      
      if(people) {
        people.active = false;
        people = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(people);
          },
        );
        return res.status(200).json({
          message: "people deleted successfully",
          data: people,
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
