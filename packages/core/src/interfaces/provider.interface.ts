import { ClassProvider } from './class-provider.interface';
import { ExistingProvider } from './existing-provider.interface';
import { FactoryProvider } from './factory-provider.interface';
import { TypeProvider } from './type-provider.interface';
import { ValueProvider } from './value-provider.interface';

export type Provider<T = any> = TypeProvider<T> | ClassProvider<T> | ExistingProvider<T> | FactoryProvider<T> | ValueProvider<T>;
