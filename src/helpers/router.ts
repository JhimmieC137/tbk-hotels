import { HotelsModule } from 'src/modules/hotels/hotels.module';
import { ReservationsModule } from 'src/modules/reservations/reservations.module';
export const baseRoute = 'api/v1';

const hotelsRoute = {
  path: baseRoute,
  module: HotelsModule,
};

const reservationRoute = {
  path: baseRoute,
  module: ReservationsModule,
};


export const appRoutes = [
  hotelsRoute,
  reservationRoute
];
