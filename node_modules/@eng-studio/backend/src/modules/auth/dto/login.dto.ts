import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @IsString({ message: 'Device ID phải là chuỗi' })
  @IsNotEmpty({ message: 'Device ID không được để trống' })
  deviceId: string;
}

export class RegisterDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @IsString({ message: 'Họ và tên không được để trống' })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  fullName: string;

  @IsString({ message: 'Device ID phải là chuỗi' })
  @IsNotEmpty({ message: 'Device ID không được để trống' })
  deviceId: string;
}
