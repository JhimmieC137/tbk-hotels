import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm'; 
  
@Entity('reservations')
export class Reservation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: true,
    })
    user_id: String;

    @CreateDateColumn({
    nullable: true
    })
    created_at: Date;

    @UpdateDateColumn({
    nullable: true
    })
    updated_at: Date;

    @DeleteDateColumn({
    nullable: true
    })
    deleted_at: Date;
}
