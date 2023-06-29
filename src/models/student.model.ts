import {Entity, model, property} from '@loopback/repository';

@model()
export class Student extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })

  firstname: string;

  @property({
    type: 'string',
    required: true,
  })

  lastname: string;

  @property({
    type: 'string',
    required: true,
  })

  mobileNo: string;

  @property({
    type: 'string',
    required: true,
  })

  email: string;

  @property({
    type: 'string',
    required: true,
    minLength: 8
  })

  password: string;

  constructor(data?: Partial<Student>) {
    super(data);
  }
}

export interface StudentRelations {
  // describe navigational properties here
}

export type StudentWithRelations = Student & StudentRelations;
