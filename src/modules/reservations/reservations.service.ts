import { Inject, Injectable } from '@nestjs/common';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReservationDto, ReservationQueryDto, UpdateReservationDto } from './dto/resquests.dto';
import { ReservationQueryResponseDto } from './dto/responses.dto';
import { NOT_FOUND_404 } from 'src/helpers/exceptions/auth';
import { TokenBlacklist } from '../hotels/entities/blacklist.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(TokenBlacklist)
    private blacklistRepository: Repository<TokenBlacklist>,
    @Inject('NOTIFICATION_SERVICE')
    private rabbitClientNotification: ClientProxy,
  ){}

  async create(user_id: string, createReservationDto: CreateReservationDto): Promise<Reservation> {
    try{
      const newReservation = new Reservation();
      newReservation.user_id = user_id;
      newReservation.hotel = createReservationDto.hotel;

      const newRservationObj = await this.reservationRepository.save(newReservation);

      // Notify
      this.rabbitClientNotification.emit(
        'create-notification',
        JSON.stringify({
          user_id: user_id,
          message: "Your hotel reservation has been created. Find more information in your email"
        })
      )

      return newRservationObj;

    } catch (error) {
      throw error
    }
  }

  async findAll( user_id: string, page: number, limit: number, search: string ): Promise<ReservationQueryResponseDto> {
    if (!page) page = 1;
    if (!limit) limit = 10;
    const offset = (page - 1) * limit
    try{
      const [reservations, totalCount] = await this.reservationRepository.findAndCount({
        where: {user_id},
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

  async findOne(user_id: string, id: string) {
    try{
      const reservationObj = await this.reservationRepository.findOne({
        where: {id, user_id}
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

  async update(id: string, user_id: string,  updateReservationDto: UpdateReservationDto) {
    try {
      
      const reservationObj = await this.reservationRepository.findOne({
        where: {id, user_id}
      })

      if (!reservationObj) {
        throw new NOT_FOUND_404("Reservation not found");
      }
      // else if (reservationObj && !reservationObj.profile.is_active) {
      //   throw new BAD_REQUEST_400("reservation has been deactivated");
      // }


      // Notify
      this.rabbitClientNotification.emit(
        'create-notification',
        JSON.stringify({
          user_id: user_id,
          message: "You made updates to your reservation. Find more information in your email"
        })
      )

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

  async remove(user_id: string, id: string) {
    try {
      
      const reservationObj = await this.reservationRepository.findOne({
        where: {id, user_id}
      })

      if (!reservationObj) {
        throw new NOT_FOUND_404("Reservation not found");
      }
      // else if (reservationObj && !reservationObj.profile.is_active) {
      //   throw new BAD_REQUEST_400("reservation has been deactivated");
      // }

      await this.reservationRepository.remove(reservationObj);

      this.rabbitClientNotification.emit(
        'create_notifiation',
        JSON.stringify({
          user_id,
          message: "You made updates to your reservation. Find more information in your email"
        })
      )

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
