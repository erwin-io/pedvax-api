/** source/controllers/posts.ts */
import { Router, Request, Response, NextFunction } from "express";
import { Vaccination } from "../db/entities/Vaccination";
import { getManager, getRepository } from "typeorm";
import { HealthCenter } from "../db/entities/HealthCenter";
import { People } from "../db/entities/People";
import { Vaccine } from "../db/entities/Vaccine";

export const vaccinationRouter = Router();

vaccinationRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    let vaccinations: Vaccination[] = await getRepository(Vaccination).find({
      where: {
        active: true
      },
      relations: {
        vaccine: true,
        people: true,
        healthCenter: true,
      }
    });
    return res.status(200).json({
      data: vaccinations,
    });
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

vaccinationRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    let vaccination: Vaccination = await getRepository(Vaccination).findOne({
      where: {
        vaccinationId: id,
        active: true
      },
      relations: {
        vaccine: true,
        people: true,
        healthCenter: true,
      }
    });
    return res.status(200).json({
      message: vaccination,
    });
  } catch (ex) {
    return res.status(500).json({
      message: ex.message,
    });
  }
});

vaccinationRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body && 
        req.body.vaccineId &&
        req.body.peopleId &&
        req.body.healthCenterId &&
        req.body.scheduleDate) {
      const { vaccineId, peopleId, healthCenterId, scheduleDate } = req.body;
      let vaccination = new Vaccination();

      const vaccine = await getRepository(Vaccine).findOne({
        where: {
          vaccineId,
          active: true
        }
      });
      if(!vaccine) {
        return res.status(404).json({
          message: "Bad Request!",
        });
      }
      vaccination.vaccine = vaccine;

      const people = await getRepository(People).findOne({
        where: {
          peopleId,
          active: true
        },
        relations: {
          healthCenter: true,
        }
      });
      if(!people) {
        return res.status(404).json({
          message: "Bad Request!",
        });
      }
      vaccination.people = people;
      
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
      vaccination.healthCenter = healthCenter;
      
      vaccination.scheduleDate = scheduleDate;
      vaccination = await getManager().transaction(
        async (transactionalEntityManager) => {
          return await transactionalEntityManager.save(vaccination);
        },
      );
      return res.status(200).json({
        data: vaccination,
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

vaccinationRouter.put("/:id", async (req: Request,res: Response,next: NextFunction,) => {

  try {
    if (req.body && 
        req.body.vaccineId &&
        req.body.peopleId &&
        req.body.healthCenterId &&
        req.body.createdDate &&
        req.body.scheduleDate) {
      const { id } = req.params;
      const { vaccineId, peopleId, healthCenterId, scheduleDate } = req.body;

      let vaccination = await getRepository(Vaccination).findOne({
        where: {
          vaccinationId: id,
          active: true
        },
        relations: {
          vaccine: true,
          people: true,
          healthCenter: true,
        }
      });
      if(vaccination) {
        if(vaccineId !== vaccination.vaccine.vaccineId) {
          const vaccine = await getRepository(Vaccine).findOne({
            where: {
              vaccineId,
              active: true
            }
          });
          if(!vaccine) {
            return res.status(404).json({
              message: "Bad Request!",
            });
          }
          vaccination.vaccine = vaccine;
        }
        
        if(peopleId !== vaccination.people.peopleId) {
          const people = await getRepository(People).findOne({
            where: {
              peopleId,
              active: true
            }
          });
          if(!people) {
            return res.status(404).json({
              message: "Bad Request!",
            });
          }
          vaccination.people = people;
        }

        if(healthCenterId !== vaccination.healthCenter.healthCenterId) {
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
          vaccination.healthCenter = healthCenter;
        }
        
        vaccination.scheduleDate = scheduleDate;
        vaccination = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(vaccination);
          },
        );
        return res.status(200).json({
          message: "vaccination updated successfully",
          data: vaccination,
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

vaccinationRouter.delete("/:id", async ( req: Request, res: Response, next: NextFunction,) => {
  try {
    if (req.params && req.params.id) {
      let { id } = req.params;
      let vaccination: Vaccination = await getRepository(Vaccination).findOne({
        where: {
          vaccinationId: id,
          active: true
        },
        relations: {
          vaccine: true,
          people: true,
          healthCenter: true,
        }
      });
      
      if(vaccination) {
        vaccination.active = false;
        vaccination = await getManager().transaction(
          async (transactionalEntityManager) => {
            return await transactionalEntityManager.save(vaccination);
          },
        );
        return res.status(200).json({
          message: "vaccination deleted successfully",
          data: vaccination,
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
