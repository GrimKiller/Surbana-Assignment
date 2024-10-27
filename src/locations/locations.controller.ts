import { Controller, Param, Body, Get, Post, Put, Patch, Delete } from '@nestjs/common'
import { LocationsService } from './locations.service'
import { CreateLocationDto } from './dto/create-location.dto'
import { UpdateLocationDto } from './dto/update-location.dto'

@Controller('location')
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {}

    @Get()
    findAll() {
        return this.locationsService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.locationsService.findOne(+id)
    }

    @Post()
    create(@Body() createLocationDto: CreateLocationDto) {
        return this.locationsService.create(createLocationDto)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
        return this.locationsService.update(+id, updateLocationDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.locationsService.remove(+id)
    }
}
