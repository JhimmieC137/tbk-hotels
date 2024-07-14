import { HotelsModule } from 'src/modules/hotels/hotels.module';
export const baseRoute = 'api/v1';

const hotelsRoute = {
  path: baseRoute,
  module: HotelsModule,
};


export const appRoutes = [
  hotelsRoute,
];
