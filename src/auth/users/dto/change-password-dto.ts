import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  old_password: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  new_password: string;
}
