import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TreeRepository } from 'typeorm'
import { CreateLocationDto } from './dto/create-location.dto'
import { UpdateLocationDto } from './dto/update-location.dto'
import { Location } from './entities/location.entity'

@Injectable()
export class LocationsService {
    logger: Logger

    constructor(
        @InjectRepository(Location)
        private locationRepository: TreeRepository<Location>
    ) {
        this.logger = new Logger(LocationsService.name)
    }

    findAll(): Promise<Location[]> {
        return this.locationRepository.findTrees()
    }

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

    async create(createLocationDto: CreateLocationDto): Promise<Location> {
        const location = this.locationRepository.create(createLocationDto)

        if (createLocationDto.parentId) {
            const parent = await this.locationRepository.findOne({
                where: { id: createLocationDto.parentId },
            })
            if (!parent) {
                this.logger.error(`Parent location not found with ID ${createLocationDto.parentId}!`)
                throw new NotFoundException(`No parent location with ID ${createLocationDto.parentId}!`)
            }
            location.parent = parent
        }

        return this.locationRepository.save(location)
    }

    async update(id: number, updateLocationDto: UpdateLocationDto): Promise<Location> {
        var location = await this.findOne(id)

        if (updateLocationDto.parentId && updateLocationDto.parentId !== location.parent?.id) {
            const newParent = await this.locationRepository.findOne({
                where: { id: updateLocationDto.parentId },
            })
            if (!newParent) {
                this.logger.error(`Parent location not found with ID ${updateLocationDto.parentId}!`)
                throw new NotFoundException(`No parent location with ID ${updateLocationDto.parentId}!`)
            }
            location.parent = newParent
        }

        Object.assign(location, updateLocationDto)

        try {
            return await this.locationRepository.save(location)
        } catch (error) {
            this.logger.error({ messaage: `Error on updating location with ID ${id}!`, error })
            throw new ConflictException(`Error on updating location with ID ${id}`)
        }
    }

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
