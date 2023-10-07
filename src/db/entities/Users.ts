import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("u_user", ["active", "mobileNumber"], { unique: true })
@Index("pk_users_1557580587", ["userId"], { unique: true })
@Entity("Users", { schema: "dbo" })
export class Users {
  @PrimaryGeneratedColumn({ type: "bigint", name: "UserId" })
  userId: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("character varying", { name: "MobileNumber" })
  mobileNumber: string;

  @Column("character varying", { name: "Password" })
  password: string;

  @Column("character varying", { name: "UserType" })
  userType: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;
}
