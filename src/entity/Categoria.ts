import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Denuncia } from "./Denuncia";

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  nome: string;

  @Column({ type: "varchar" })
  descricao: string;

  @OneToMany(() => Denuncia, (denuncia) => denuncia.categoria)
  denuncias: Denuncia[];
}
