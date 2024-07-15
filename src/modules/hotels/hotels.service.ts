import { Injectable } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { Repository } from 'typeorm';
import { BAD_REQUEST_400, NOT_FOUND_404 } from 'src/helpers/exceptions/auth';
import { HotelsQueryResponseDto } from './dto/responses.dto';
import { TokenBlacklist } from './entities/blacklist.entity';

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
    @InjectRepository(TokenBlacklist)
    private blacklistRepository: Repository<TokenBlacklist>,

  ){}

  async create(createHotelDto: CreateHotelDto): Promise<Hotel> {
    try{
      const newHotel = new Hotel();
      newHotel.name = createHotelDto.name;
      newHotel.address = createHotelDto.address;

      const newHotelObj = await this.hotelRepository.save(newHotel);

      return newHotelObj;

    } catch (error) {
      throw error
    }
  }

  async findAll(page: number, limit: number, search: string): Promise<HotelsQueryResponseDto> {
    if (!page) page = 1;
    if (!limit) limit = 10;
    const offset = (page - 1) * limit
    try {
      
      const [hotels, totalCount] = await this.hotelRepository.findAndCount({
        where: {
          is_active: true,
        },
        skip: offset,
        take: limit
      })

      return {
        hotels,
        page,
        totalCount
      }

    } catch (error) {
      throw error
    }
  }

  async findOne(id: string) {

    try {
      
      const hotel = await this.hotelRepository.findOne({
        where: {
          id,
        }
      })

      if (!hotel) {
        throw new NOT_FOUND_404("Hotel not found");
      } else if (hotel && !hotel.is_active) {
        throw new BAD_REQUEST_400("Hotel has been deactivated");
      }

      return hotel;

    } catch (error) {
      throw error
    }

  }

  async update(id: string, updateHotelDto: UpdateHotelDto) {
    try {

      const hotel = await this.hotelRepository.findOne({
        where: {
          id,
        }
      })


      if (!hotel) {
        throw new NOT_FOUND_404("Hotel not found");
      } else if (hotel && !hotel.is_active) {
        throw new BAD_REQUEST_400("Hotel has been deactivated");
      }

      
      await this.hotelRepository.update( id, {
        ...updateHotelDto
      })

      const updatedHotel = await this.hotelRepository.findOne({
        where: {id}
      })

      return updatedHotel;

    } catch (error) {
      throw error
    }
  }

  async remove(id: string) {
    try {
      
      const hotel = await this.hotelRepository.findOne({
        where: {
          id
        }
      })
  
  
      if (!hotel) {
        throw new NOT_FOUND_404("Hotel not found");
      } else if (hotel && !hotel.is_active) {
        throw new BAD_REQUEST_400("Hotel has been deactivated already");
      }
  
      hotel.is_active = false;
  
      await this.hotelRepository.save(hotel);
      
    } catch (error) {
      throw error
    }
  }


  async blacklistToken(token: string) {
    try {

      const blackToken = new TokenBlacklist();
      blackToken.token = token;
  
      await this.blacklistRepository.save(blackToken);
      
      return "Token blacklisted successfully"
    } catch (error) {
      throw error
    }
  }
}
