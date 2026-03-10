import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { VeterinarianIntervention } from "./VeterinarianIntervention"

@Entity()
export class Veterinarian {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ nullable: true, default: () => 'NULL' })
    phone: string

    @Column({ nullable: true, default: () => 'NULL' })
    mail: string

    @Column({ nullable: true, default: () => 'NULL' })
    emergencies: boolean

    @Column({ nullable: true, default: () => 'NULL' })
    appointmentConfirmationProcedure: string

    @Column({ nullable: true, default: () => 'NULL' })
    invoicePaymentDate: string

    @Column({ nullable: true, default: () => 'NULL' })
    paymentMethod: string

    @Column({ nullable: true, default: () => 'NULL' })
    address: string

    @Column({ nullable: true, default: () => 'NULL' })
    latitude: number

    @Column({ nullable: true, default: () => 'NULL' })
    longitude: number

    @Column({ nullable: true, default: () => 'NULL' })
    priceLevel: number
    
    @OneToMany(() => VeterinarianIntervention, intervention => intervention.veterinarian)
    interventions: VeterinarianIntervention[]

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date
}