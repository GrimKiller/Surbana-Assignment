import { Entity, Tree, TreeChildren, TreeParent, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
@Tree('closure-table')
export class Location {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    building: string

    @Column()
    locationName: string

    @Column()
    locationNumber: string

    @Column('decimal', { precision: 20, scale: 3 })
    area: number

    @TreeParent()
    parent: Location

    @TreeChildren()
    children: Location[]
}
