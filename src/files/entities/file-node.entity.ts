import { Column, Entity, PrimaryColumn,  } from "typeorm";
@Entity("ArchivosNodos")
export class FileNode {
  @PrimaryColumn({ select: false })
  id: number;

  @Column({ name: "archivo", })
  name: string;

}