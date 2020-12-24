import { ApplicationBuilder, ApplicationBuilderOptions } from './application-builder';

export class Artisan {
  public static configureApplication(options: ApplicationBuilderOptions = {}): ApplicationBuilder {
    return new ApplicationBuilder(options);
  }
}
