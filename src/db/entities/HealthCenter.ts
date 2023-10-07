import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { People } from "./People";
import { Vaccination } from "./Vaccination";

@Index("u_healthcenter", ["active", "name"], { unique: true })
@Index("HealthCenter_pkey", ["healthCenterId"], { unique: true })
@Entity("HealthCenter", { schema: "dbo" })
export class HealthCenter {
  @PrimaryGeneratedColumn({ type: "bigint", name: "HealthCenterId" })
  healthCenterId: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("numeric", { name: "MapLocationX" })
  mapLocationX: string;

  @Column("numeric", { name: "MapLocationY" })
  mapLocationY: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @OneToMany(() => People, (people) => people.healthCenter)
  people: People[];

  @OneToMany(() => Vaccination, (vaccination) => vaccination.healthCenter)
  vaccinations: Vaccination[];
}
