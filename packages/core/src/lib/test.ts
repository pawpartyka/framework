import { TestingApplicationBuilder, TestingApplicationBuilderOptions } from './testing-application-builder';

export class Test {
  public static configureTestingApplication(options: TestingApplicationBuilderOptions = {}): TestingApplicationBuilder {
    return new TestingApplicationBuilder(options);
  }
}
