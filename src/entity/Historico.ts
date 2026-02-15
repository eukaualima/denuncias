import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Denuncia } from "./Denuncia";

@Entity()
export class Historico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  comentario: string;

  @Column({ type: "varchar" })
  responsavel: string;

  @CreateDateColumn()
  data: Date;

  @ManyToOne(() => Denuncia, (denuncia) => denuncia.historicos)
  denuncia: Denuncia;
}
