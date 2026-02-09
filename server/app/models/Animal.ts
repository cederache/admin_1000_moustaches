import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from "typeorm"
import { Species } from "./Species"
import { AnimalHostFamily } from "./AnimalHostFamily"
import { VeterinarianIntervention } from "./VeterinarianIntervention"
import { User } from "./User"

@Entity()
export class Animal {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @ManyToOne(() => Species, species => species.animals)
    species: Species

    @Column({ nullable: true, default: () => 'NULL' })
    icad: string

    @Column({ nullable: true, default: () => 'NULL' })
    sexe: string

    @Column({ nullable: true, default: () => 'NULL' })
    race: string

    @Column({ nullable: true, default: () => 'NULL' })
    birthdate: Date

    @Column({ nullable: true, default: () => 'NULL' })
    entryDate: Date

    @Column({ nullable: true, default: () => 'NULL' })
    distinctiveSigns: string

    @Column({ nullable: true, default: () => 'NULL' })
    reasonForCare: string

    @Column({ nullable: true, default: () => 'NULL' })
    placeOfCare: string

    @Column({ nullable: true, default: () => 'NULL' })
    careInfos: string

    @Column({ nullable: true, default: () => 'NULL' })
    exitDate: Date

    @Column({ nullable: true, default: () => 'NULL' })
    exitReason: string

    @Column({ nullable: true, default: () => 'NULL' })
    exitInfos: string

    @Column({ nullable: true, default: () => 'NULL' })
    deathDate: Date

    @Column({ nullable: true, default: () => 'NULL' })
    deathReason: string

    @Column({ nullable: true, default: () => 'NULL' })
    sterilised: boolean

    @Column({ nullable: true, default: () => 'NULL' })
    firstVaccinationDate: Date

    @Column({ nullable: true, default: () => 'NULL' })
    secondVaccinationDate: Date

    @Column({ nullable: true, default: () => 'NULL' })
    fivNegative: boolean

    @Column({ nullable: true, default: () => 'NULL' })
    felvNegative: boolean

    @Column({ nullable: true, default: () => 'NULL' })
    healthIssues: string

    @Column({ nullable: true, default: () => 'NULL' })
    behaviour: string

    @Column({ nullable: true, default: () => 'NULL'})
    needFriends: boolean

    @Column({ nullable: true, default: () => 'NULL' })
    posture: string

    @Column({ nullable: true, default: () => 'NULL'})
    catsOk: boolean

    @Column({ nullable: true, default: () => 'NULL'})
    dogsOk: boolean

    @Column({ nullable: true, default: () => 'NULL'})
    kidsOk: boolean

    @Column({ nullable: true, default: () => 'NULL'})
    behaviorParticularity: string

    @Column({ nullable: true, default: () => 'NULL' })
    adopted: boolean

    @Column({ nullable: true, default: () => 'NULL' })
    broadcastable: boolean

    @Column({ nullable: true, default: () => 'NULL' })
    bookable: boolean

    @Column({ nullable: true, default: () => 'NULL' })
    needExternalAccess: boolean

    @Column({ nullable: true, default: () => 'NULL' })
    transferor: string

    @Column({ nullable: true, default: () => 'NULL' })
    antiParasiticDate: Date

    @Column({ nullable: true, default: () => 'NULL' })
    transferCertificate: boolean

    @Column({ nullable: true, default: () => 'NULL' })
    reserved: boolean

    @Column({ nullable: true, default: () => 'NULL' })
    needIcadDuplicate: string

    @Column({ nullable: true, default: () => 'NULL' })
    contractSent: boolean

    @Column({ nullable: true, default: () => 'NULL' })
    albumCreated: boolean

    @OneToMany(() => AnimalHostFamily, relation => relation.animal)
    hostFamilyRelations: AnimalHostFamily[]

    @OneToMany(() => VeterinarianIntervention, intervention => intervention.animal)
    veterinarianInterventions: VeterinarianIntervention[]

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date
}