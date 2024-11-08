import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TreeRepository } from 'typeorm'
import { CreateLocationDto } from './dto/create-location.dto'
import { UpdateLocationDto } from './dto/update-location.dto'
import { Location } from './entities/location.entity'

/**
 * Location service that managing all the CRUD of Location
 *
 * @export
 * @class LocationsService
 * @typedef {LocationsService}
 */
@Injectable()
export class LocationsService {
    logger: Logger

    constructor(
        @InjectRepository(Location)
        private locationRepository: TreeRepository<Location>
    ) {
        this.logger = new Logger(LocationsService.name)
    }

    /**
     * Fetches all root locations (without parent location).
     *
     * @returns {Promise<Location[]>} List of Locations.
     */
    findAll(): Promise<Location[]> {
        return this.locationRepository.findTrees()
    }

    /**
     * Find a specific location with ID.
     *
     * @async
     * @param {number} id - The ID of the location to fetch.
     * @returns {Promise<Location>} Location data.
     */
    async findOne(id: number): Promise<Location> {
        const location = await this.locationRepository.findOne({
            where: { id },
            relations: ['children'],
        })
        if (!location) {
            this.logger.error(`No location on loeading with ID ${id}!`)
            throw new NotFoundException(`No location with ID ${id}!`)
        }
        return location
    }

    /**
     * Create new Location using location data
     *
     * @async
     * @param {CreateLocationDto} createLocationDto - New location data in format
     * @returns {Promise<Location>} Created Location including created ID
     */
    async create(createLocationDto: CreateLocationDto): Promise<Location> {
        const location = this.locationRepository.create(createLocationDto)
        let parent: Location

        if (createLocationDto.parentId) {
            parent = await this.locationRepository.findOne({
                where: { id: createLocationDto.parentId },
            })

            if (!parent) {
                this.logger.error(`Parent location not found with ID ${createLocationDto.parentId}!`)
                throw new NotFoundException(`No parent location with ID ${createLocationDto.parentId}!`)
            }
        } else {
            const parentNumber = location.getLocationParentNumber()
            parent = await this.locationRepository.findOne({
                where: [{ locationNumber: parentNumber }],
            })
        }

        location.parent = parent
        try {
            const savedLocation = this.locationRepository.save(location)
            return savedLocation
        } catch (error) {
            this.logger.error(`Error on creating location`, error)
            throw new NotFoundException(`Error on creating location!`)
        }
    }

    /**
     * Patch location with ID using location data
     *
     * @async
     * @param {number} id - ID of the Location to be patched
     * @param {UpdateLocationDto} updateLocationDto - Patch location data in format
     * @returns {Promise<Location>} Patched Location
     */
    async patch(id: number, updateLocationDto: UpdateLocationDto): Promise<Location> {
        const location = await this.findOne(id)
        Object.assign(location, updateLocationDto)
        let newParent: Location

        if (updateLocationDto.parentId) {
            newParent = await this.locationRepository.findOne({
                where: { id: updateLocationDto.parentId },
            })

            if (!newParent) {
                this.logger.error(`Parent location not found with ID ${updateLocationDto.parentId}!`)
                throw new NotFoundException(`No parent location with ID ${updateLocationDto.parentId}!`)
            }
        } else {
            newParent = await this.locationRepository.findOne({
                where: [{ locationNumber: location.getLocationParentNumber() }],
            })
        }

        if (newParent) {
            const descendants = await this.locationRepository.findDescendants(location)
            if (descendants.find((loc) => loc.id === newParent.id)) {
                this.logger.error(`Parent location with ID ${updateLocationDto.parentId} is decendant of updating location!`)
                throw new ConflictException(`Parent location with ID ${updateLocationDto.parentId} is decendant of updating location!`)
            }

            location.parent = newParent
        }

        try {
            return await this.locationRepository.save(location)
        } catch (error) {
            this.logger.error(`Error on updating location`, error)
            throw new NotFoundException(`Error on updating location!`)
        }
    }

    /**
     * Update location with ID using location data
     *
     * @async
     * @param {number} id - ID of the Location to be updated
     * @param {UpdateLocationDto} updateLocationDto - Update location data in format
     * @returns {Promise<Location>} Updated Location
     */
    async update(id: number, updateLocationDto: CreateLocationDto): Promise<Location> {
        const location = await this.findOne(id)
        Object.assign(location, updateLocationDto)
        let newParent: Location

        if (updateLocationDto.parentId) {
            newParent = await this.locationRepository.findOne({
                where: { id: updateLocationDto.parentId },
            })

            if (!newParent) {
                this.logger.error(`Parent location not found with ID ${updateLocationDto.parentId}!`)
                throw new NotFoundException(`No parent location with ID ${updateLocationDto.parentId}!`)
            }
        } else {
            newParent = await this.locationRepository.findOne({
                where: [{ locationNumber: location.getLocationParentNumber() }],
            })
        }

        if (newParent) {
            const descendants = await this.locationRepository.findDescendants(location)
            if (descendants.find((loc) => loc.id === newParent.id)) {
                this.logger.error(`Parent location with ID ${updateLocationDto.parentId} is decendant of updating location!`)
                throw new ConflictException(`Parent location with ID ${updateLocationDto.parentId} is decendant of updating location!`)
            }
        }
        location.parent = newParent

        try {
            return await this.locationRepository.save(location)
        } catch (error) {
            this.logger.error(`Error on updating location`, error)
            throw new NotFoundException(`Error on updating location!`)
        }
    }

    /**
     * Delete a location with ID
     *
     * @async
     * @param {number} id - ID of the Location to be deleted
     * @returns {Promise<void>} Function will throw error on any deleting issue
     */
    async remove(id: number): Promise<void> {
        const location = await this.findOne(id)

        try {
            const descendants = await this.locationRepository.findDescendants(location)
            await this.locationRepository.remove(descendants)
        } catch (error) {
            this.logger.error({ messaage: `Error on deleting location with ID ${id}!`, error })
            throw new ConflictException(`Error on deleting location with ID ${id}`)
        }
    }
}
