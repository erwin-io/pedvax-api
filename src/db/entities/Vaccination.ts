import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { HealthCenter } from "./HealthCenter";
import { People } from "./People";
import { Vaccine } from "./Vaccine";

@Index("Vaccination_pkey", ["vaccinationId"], { unique: true })
@Entity("Vaccination", { schema: "dbo" })
export class Vaccination {
  @PrimaryGeneratedColumn({ type: "bigint", name: "VaccinationId" })
  vaccinationId: string;

  @Column("date", { name: "CreatedDate", default: () => "'2023-10-03'" })
  createdDate: string;

  @Column("date", { name: "ScheduleDate" })
  scheduleDate: string;

  @Column("date", { name: "CompletedDate", nullable: true })
  completedDate: string | null;

  @Column("boolean", { name: "IsCompleted", default: () => "false" })
  isCompleted: boolean;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @ManyToOne(() => HealthCenter, (healthCenter) => healthCenter.vaccinations)
  @JoinColumn([
    { name: "HealthCenterId", referencedColumnName: "healthCenterId" },
  ])
  healthCenter: HealthCenter;

  @ManyToOne(() => People, (people) => people.vaccinations)
  @JoinColumn([{ name: "PeopleId", referencedColumnName: "peopleId" }])
  people: People;

  @ManyToOne(() => Vaccine, (vaccine) => vaccine.vaccinations)
  @JoinColumn([{ name: "VaccineId", referencedColumnName: "vaccineId" }])
  vaccine: Vaccine;
}
