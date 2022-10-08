import {
    BaseEntity,
    Column,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    RelationId,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

/**
 * State
 */
@Entity('cookies', { schema: 'genshin-uid' })
export class Cookie {
    /**
     * id
     */
    @PrimaryGeneratedColumn({
        type: 'int',
    })
    uid!: number;

    /**cookies */
    @Column('text', {
        nullable: false,
    })
    cookies!: string;

    /**token */
    @Column('int', {
        nullable: false,
    })
    qid!: number;

    /**
     * statusA
     */
    @Column('varchar', {
        nullable: false,
    })
    statusA!: string;

    /**
     * statusA
     */
    @Column('varchar', {
        nullable: false,
    })
    statusB!: string;

    /**
     * statusC
     */
    @Column('varchar', {
        nullable: false,
    })
    statusC!: string;

    /**token */
    @Column('int', { nullable: true })
    num!: number;

    /**sToken */
    @Column('varchar', { nullable: true })
    extra!: string;

    /**sToken */
    @Column('text', { nullable: true })
    sToken!: string;

    /**createdAt */
    @CreateDateColumn()
    createdAt!: Date;
}
