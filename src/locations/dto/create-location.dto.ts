import { IsString, IsNumber, IsOptional, IsNotEmpty, IsPositive } from 'class-validator'

export class CreateLocationDto {
    @IsString({ message: 'Bulding must be a string' })
    @IsNotEmpty({ message: 'Bulding must not be empty' })
    building: string

    @IsString({ message: 'Location name must be a string' })
    @IsNotEmpty({ message: 'Location name must not be empty' })
    locationName: string

    @IsString({ message: 'Location number must be a string' })
    @IsNotEmpty({ message: 'Location number must not be empty' })
    locationNumber: string

    @IsNumber()
    @IsPositive({ message: 'Location size cannot be negative' })
    area: number

    @IsOptional()
    @IsNumber()
    parentId?: number
}
