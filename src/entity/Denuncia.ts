import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Categoria } from "./Categoria";
import { Historico } from "./Historico";

export enum Prioridade {
  BAIXA = "baixa",
  MEDIA = "media",
  ALTA = "alta",
}

export enum Status {
  ABERTA = "aberta",
  RESOLVIDA = "resolvida",
  PROGRESSO = "progresso",
  FECHADA = "fechada",
  CANCELADA = "cancelada",
}

@Entity()
export class Denuncia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  titulo: string;

  @Column({ type: "text" })
  descricao: string;

  @ManyToOne(() => Categoria, (categoria) => categoria.denuncias)
  categoria: Categoria;

  @Column({ type: "text" })
  local: string;

  @Column({ type: "simple-enum", enum: Prioridade, default: Prioridade.BAIXA })
  prioridade: string;

  @Column({ type: "simple-enum", enum: Status, default: Status.ABERTA })
  status: string;

  @Column({ type: "varchar", nullable: true })
  registrante: string;

  @OneToMany(() => Historico, (historico) => historico.denuncia)
  historicos: Historico[];
}
