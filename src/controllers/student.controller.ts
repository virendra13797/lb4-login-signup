import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getJsonSchemaRef,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response
} from '@loopback/rest';

import {Student} from '../models';


import {Credentials, StudentRepository} from '../repositories';
// import {CredentialsRequestBody} from './specs/students.controller.spec';
import {validateCredentials} from '../services/validator';

import {inject} from '@loopback/core';
import { } from '@loopback/testlab';
import * as _ from "lodash";
import {BcryptHasher} from '../services/hash.password.bcrypt';
import {JwtService} from '../services/JwtService';
import {MyStudentService} from '../services/student-service';





export class StudentController {
  constructor(
    @repository(StudentRepository)
    public studentRepository: StudentRepository,
    @inject('service.hasher')
    public hasher: (BcryptHasher),
    @inject('services.student.service')
    public studentService: MyStudentService,
    @inject('services.Jwt.service')
    public jwtService: JwtService
  ) { }

  @post('/students/signup', {
    responses: {
      "200": {
        discription: "Student sign up",
        content: {schema: getJsonSchemaRef(Student)},
      },
    },
  })

  async signup(@requestBody(StudentRepository) studentData: Student) {
    validateCredentials(_.pick(studentData, ["email", "password"]))
    studentData.password = await this.hasher.hashpassword(studentData.password)
    const savedStudent = await this.studentRepository.create(studentData);

    //delete savedStudent.password ........ optional but creating an error

    return savedStudent
  }

  @post('/students/login', {
    responses: {
      "200": {
        discription: "Token",
        content: {

          "application/json": {
            schema: {
              type: "Object",
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })

  async login(@requestBody(requestBody) credentials: Credentials,): Promise<{token: String}> {

    //make sure the student should be exist and password....
    const student = await this.studentService.verifyCredentials(credentials)
    console.log(student);
    const UserProfile = await this.studentService.convertToUserProfile(student);
    console.log(UserProfile);
    const token = await this.jwtService.generateToken(UserProfile);
    return Promise.resolve({token, student})

  }


  @post('/students')
  @response(200, {
    description: 'Student model instance',
    content: {'application/json': {schema: getModelSchemaRef(Student)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Student, {
            title: 'NewStudent',
            exclude: ['id'],
          }),
        },
      },
    })
    student: Omit<Student, 'id'>,
  ): Promise<Student> {
    return this.studentRepository.create(student);
  }

  @get('/students/count')
  @response(200, {
    description: 'Student model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Student) where?: Where<Student>,
  ): Promise<Count> {
    return this.studentRepository.count(where);
  }

  @get('/students')
  @response(200, {
    description: 'Array of Student model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Student, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Student) filter?: Filter<Student>,
  ): Promise<Student[]> {
    return this.studentRepository.find(filter);
  }

  @patch('/students')
  @response(200, {
    description: 'Student PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Student, {partial: true}),
        },
      },
    })
    student: Student,
    @param.where(Student) where?: Where<Student>,
  ): Promise<Count> {
    return this.studentRepository.updateAll(student, where);
  }

  @get('/students/{id}')
  @response(200, {
    description: 'Student model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Student, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Student, {exclude: 'where'}) filter?: FilterExcludingWhere<Student>
  ): Promise<Student> {
    return this.studentRepository.findById(id, filter);
  }

  @patch('/students/{id}')
  @response(204, {
    description: 'Student PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Student, {partial: true}),
        },
      },
    })
    student: Student,
  ): Promise<void> {
    await this.studentRepository.updateById(id, student);
  }

  @put('/students/{id}')
  @response(204, {
    description: 'Student PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() student: Student,
  ): Promise<void> {
    await this.studentRepository.replaceById(id, student);
  }

  @del('/students/{id}')
  @response(204, {
    description: 'Student DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.studentRepository.deleteById(id);
  }
}
