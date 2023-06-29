import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {TokenServiceConstants} from './keys';
import {MySequence} from './sequence';
import {JwtService} from './services/JwtService';
import {BcryptHasher} from './services/hash.password.bcrypt';
import {MyStudentService} from './services/student-service';

export {ApplicationConfig};

export class DemoAppApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    // setup the binding method


    this.setupBinding();




    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
  setupBinding(): void {
    this.bind('service.hasher').toClass(BcryptHasher);
    this.bind("rounds").to(10);
    this.bind('services.student.service').toClass(MyStudentService);
    this.bind("services.Jwt.service").toClass(JwtService);
    this.bind('authentication.Jwt.secret').to(TokenServiceConstants.TOKEN_SECRET_VALUE);
    this.bind('authentication.Jwt.expiresIn').to(TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE);

  }
}
