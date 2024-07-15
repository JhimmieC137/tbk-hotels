import { Injectable } from '@nestjs/common';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReservationDto, ReservationQueryDto, UpdateReservationDto } from './dto/resquests.dto';
import { ReservationQueryResponseDto } from './dto/responses.dto';
import { NOT_FOUND_404 } from 'src/helpers/exceptions/auth';
import { TokenBlacklist } from '../hotels/entities/blacklist.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(TokenBlacklist)
    private blacklistRepository: Repository<TokenBlacklist>,
  ){}

  async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    try{
      const newReservation = new Reservation();
      newReservation.user_id = createReservationDto.user_id;

      const newRservationObj = await this.reservationRepository.save(newReservation);

      // Notify

      return newRservationObj;

    } catch (error) {
      throw error
    }
  }

  async findAll( page: number, limit: number, search: string ): Promise<ReservationQueryResponseDto> {
    if (!page) page = 1;
    if (!limit) limit = 10;
    const offset = (page - 1) * limit
    try{
      const [reservations, totalCount] = await this.reservationRepository.findAndCount({
        skip: offset,
        take: limit
      }) 

      return {
        reservations,
        totalCount,
        page,
      }
    } catch (error) {
      throw error
    }
  }

  async findOne(id: string) {
    try{
      const reservationObj = await this.reservationRepository.findOne({
        where: {id}
      })

      if (!reservationObj) {
        throw new NOT_FOUND_404("Reservation not found");
      }
      // else if (reservationObj && !reservationObj.profile.is_active) {
      //   throw new BAD_REQUEST_400("reservation has been deactivated");
      // }


      return reservationObj

    } catch (error) {
      throw error 
    }
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    try {
      
      const reservationObj = await this.reservationRepository.findOne({
        where: {id}
      })

      if (!reservationObj) {
        throw new NOT_FOUND_404("Reservation not found");
      }
      // else if (reservationObj && !reservationObj.profile.is_active) {
      //   throw new BAD_REQUEST_400("reservation has been deactivated");
      // }

      await this.reservationRepository.update( id, {
        ...updateReservationDto
      });
      

      const updatedReservationObj = await this.reservationRepository.findOne({
        where: {id}
      });

      // Notify

      return updatedReservationObj;

    } catch (error) {
      throw error
    }
  }

  async remove(id: string) {
    try {
      
      const reservationObj = await this.reservationRepository.findOne({
        where: {id}
      })

      if (!reservationObj) {
        throw new NOT_FOUND_404("Reservation not found");
      }
      // else if (reservationObj && !reservationObj.profile.is_active) {
      //   throw new BAD_REQUEST_400("reservation has been deactivated");
      // }

      await this.reservationRepository.remove(reservationObj);

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

  async checkBlacklist(token: string): Promise<Boolean> {
    try{
      const blackToken = await this.blacklistRepository.findOne({
        where: {token}
      });
      
      if (!blackToken) {
        return false;
      };

      return true;
    } catch (error) {
      throw error;
    }

  };
}
