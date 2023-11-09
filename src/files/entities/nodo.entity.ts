import { Column, Entity, PrimaryColumn } from "typeorm";
@Entity("Nodos")
export class Nodo {
  @PrimaryColumn({ select: false })
  id: number;

  @Column({ name: "nombre", transformer: {
    to: (value: string) => value,
    from: (value: string) => {
      return value?.trim();
    }
  }})
  name: string;

  @Column({ name: "nombreArchivo", transformer: {
    to: (value: string) => value,
    from: (value: string) => {
      return value?.trim();
    }
  } })
  nameFile: string;

  @Column({ name: "descripcion", transformer: {
    to: (value: string) => value,
    from: (value: string) => {
      return value?.trim();
    }
  } })
  description: string;

  @Column({ name: "activo" })
  status: boolean;

  @Column({ name: "nivel" })
  level: number;

  @Column({ name: "idPadre" })
  idParent: number;

  @Column({ name: "tipoNodo" })
  typeNode: string;

  @Column({ name: "idArchivo" })
  idFile: number;

  @Column({ name: "fecha" })
  date: Date;
}
