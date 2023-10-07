import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { HealthCenter } from "./HealthCenter";
import { Vaccination } from "./Vaccination";

@Index("u_people", ["active", "birthDate", "gender", "name"], { unique: true })
@Index("People_pkey", ["peopleId"], { unique: true })
@Entity("People", { schema: "dbo" })
export class People {
  @PrimaryGeneratedColumn({ type: "bigint", name: "PeopleId" })
  peopleId: string;

  @Column("character varying", { name: "Name", nullable: true })
  name: string | null;

  @Column("character varying", { name: "Gender" })
  gender: string;

  @Column("date", { name: "BirthDate" })
  birthDate: string;

  @Column("character varying", { name: "Address" })
  address: string;

  @Column("character varying", { name: "Guardian" })
  guardian: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @ManyToOne(() => HealthCenter, (healthCenter) => healthCenter.people)
  @JoinColumn([
    { name: "HealthCenterId", referencedColumnName: "healthCenterId" },
  ])
  healthCenter: HealthCenter;

  @OneToMany(() => Vaccination, (vaccination) => vaccination.people)
  vaccinations: Vaccination[];
}
