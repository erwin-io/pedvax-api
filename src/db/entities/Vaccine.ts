import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Vaccination } from "./Vaccination";

@Index("u_vaccine", ["active", "name"], { unique: true })
@Index("Vaccine_pkey", ["vaccineId"], { unique: true })
@Entity("Vaccine", { schema: "dbo" })
export class Vaccine {
  @PrimaryGeneratedColumn({ type: "bigint", name: "VaccineId" })
  vaccineId: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @OneToMany(() => Vaccination, (vaccination) => vaccination.vaccine)
  vaccinations: Vaccination[];
}
