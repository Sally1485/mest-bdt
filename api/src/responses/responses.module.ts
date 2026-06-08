import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Response, ResponseSchema } from './schemas/response.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AuthGuard } from '../common/guards/auth.guard';
import { AccessGuard } from '../common/guards/access.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Response.name, schema: ResponseSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ResponsesController],
  providers: [ResponsesService, AuthGuard, AccessGuard],
})
export class ResponsesModule {}
