import { ApplicationBuilder, ApplicationBuilderOptions } from './application-builder';

export class ArtisanFactory {
  public static configureApplication(options: ApplicationBuilderOptions = {}): ApplicationBuilder {
    return new ApplicationBuilder(options);
  }
}
