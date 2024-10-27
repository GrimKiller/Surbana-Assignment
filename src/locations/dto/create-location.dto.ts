import { IsString, IsNumber, IsOptional, IsNotEmpty, IsPositive } from 'class-validator'

export class CreateLocationDto {
    @IsString()
    @IsNotEmpty()
    building: string

    @IsString()
    @IsNotEmpty()
    locationName: string

    @IsString()
    @IsNotEmpty()
    locationNumber: string

    @IsNumber()
    @IsPositive()
    area: number

    @IsOptional()
    @IsNumber()
    parentId?: number
}
