import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {Student} from '../models';
import {Credentials, StudentRepository} from '../repositories';
import {BcryptHasher} from './hash.password.bcrypt';

// import {UserProfile} from '@loopback/security';

export class MyStudentService implements UserService<Student, Credentials> {
    constructor(
        @repository(StudentRepository)
        public studentRepository: StudentRepository,
        @inject('service.hasher')
        public hasher: BcryptHasher,
    ) { }

    async verifyCredentials(credentials: Credentials): Promise<Student> {

        const foundStudent = await this.studentRepository.findOne({
            where: {
                email: credentials.email,
            },
        });

        if (!foundStudent) {
            throw new HttpErrors.NotFound(
                `Student not found with this ${credentials.email}`
            );
        }
        const passwordMatched = await this.hasher.comparePassword(
            credentials.password,
            foundStudent.password,
        );
        if (!passwordMatched) {
            throw new HttpErrors.Unauthorized('password is not valid');
        }
        return foundStudent;
    }

    convertToUserProfile(user: Student): UserProfile {

        let userInfo = '';
        let id: string = user.id!;
        if (user.firstname) {
            userInfo = user.firstname

        }
        if (user.lastname) {
            userInfo = user.firstname ?
                `${user.firstname} ${user.lastname}` : user.lastname
        }

        return {name: userInfo, [securityId]: user.id}

    }

    // convertToUserProfile(user: Student): UserProfile {
    //     return {
    //       id: user.id,
    //       name: '<' + user.email + '>' + user.firstname,
    //       [securityId]: user.id,
    //     };
    //   }
}
