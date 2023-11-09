import { Column, Entity, PrimaryColumn } from "typeorm";




@Entity("cuotasimpagas", {
  orderBy: {
    expiredDate: "ASC",
  },
})
export class AssuranceContract {
  @PrimaryColumn({ select: false, name: "id" })
  id: number;
  @Column({ name: "nombreCliente" })
  customer: string;
  @Column({ name: "email" })
  email: string;
  @Column({ name: "telefonocelular" })
  phone: string;
  @Column({ name: "aseguradora" })
  assuranceCompany: string;
  @Column({ name: 'cedulavendedor' })
  consultant: string;
  @Column({ name: "numerocompletopoliza" })
  contract: string;
  @Column({ name: "fechainicio" })
  startContractDate: Date;

  @Column({ name: "fechafin" })
  endContractDate: Date;

  @Column({ name: "fechavencimiento" })
  expiredDate: Date;

  @Column({ name: "consecutivo" })
  orderPayment: string;
}
