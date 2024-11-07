import { Controller, Param, Body, Get, Post, Put, Patch, Delete } from '@nestjs/common'
import { LocationsService } from './locations.service'
import { CreateLocationDto } from './dto/create-location.dto'
import { UpdateLocationDto } from './dto/update-location.dto'

/**
 * Location APIs
 *
 * @export
 * @class LocationsController
 * @typedef {LocationsController}
 */
@Controller('location')
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {}

    /**
     * GET /location
     * API for fetching all root locations
     *
     * @returns {Promise<{}>}
     */
    @Get()
    findAll() {
        return this.locationsService.findAll()
    }

    /**
     * GET /location/<id>
     * API for fetching one location with ID
     *
     * @param {string} id - URL params for location ID
     * @returns {Promise<Location>}
     */
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.locationsService.findOne(+id)
    }

    /**
     * POST /location
     * API for creating new location
     *
     * @param {CreateLocationDto} createLocationDto - Location data
     * @returns {Promise<Location>}
     */
    @Post()
    create(@Body() createLocationDto: CreateLocationDto) {
        return this.locationsService.create(createLocationDto)
    }

    /**
     * PATCH /location/<id>
     * API for patching location with ID
     *
     * @param {string} id - URL params for location ID
     * @param {UpdateLocationDto} updateLocationDto - Location data
     * @returns {Promise<Location>}
     */
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
        return this.locationsService.update(+id, updateLocationDto)
    }

    /**
     * DELETE /location/<id>
     * API for deleting location with ID
     *
     * @param {string} id - URL params for location ID
     * @returns {Promise<void>}
     */
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.locationsService.remove(+id)
    }
}
