import { getProviderName, isClassProvider, isExistingProvider, isFactoryProvider, Package, Provider } from '@artisanjs/core';
import { ChannelMode } from './enums/channel-mode.enum';
import { ExchangeType } from './enums/exchange-type.enum';
import { ConnectionOptions } from './interfaces/connection-options.interface';
import { ExchangeOptions } from './interfaces/exchange-options.interface';
import { QueueOptions } from './interfaces/queue-options.interface';
import { createChannelProvider } from './providers/channel.provider';
import { createConnectionOptionsProvider, ConnectionOptionsProvider } from './providers/connection-options.provider';
import { createConnectionProvider } from './providers/connection.provider';
import { createExchangeBindingOptionsProvider, ExchangeBindingOptions, ExchangeBindingOptionsProvider } from './providers/exchange-binding-options.provider';
import { createExchangeBindingProvider, getExchangeBindingToken } from './providers/exchange-binding.provider';
import { createExchangeOptionsProvider, ExchangeOptionsProvider } from './providers/exchange-options.provider';
import { createExchangeProvider } from './providers/exchange.provider';
import { createNativeChannelProvider } from './providers/native-channel.provider';
import { createNativeConnectionProvider } from './providers/native-connection.provider';
import { createQueueBindingOptionsProvider, QueueBindingOptions, QueueBindingOptionsProvider } from './providers/queue-binding-options.provider';
import { createQueueBindingProvider, getQueueBindingToken } from './providers/queue-binding.provider';
import { createQueueOptionsProvider, QueueOptionsProvider } from './providers/queue-options.provider';
import { createQueueProvider } from './providers/queue.provider';
import { RabbitManager } from './rabbit.manager';

export class RabbitPackage {
  public static configure(): InitialConfigurator<RabbitPackage> {
    const instance = new RabbitPackage();

    return {
      declareConnection: instance.declareConnection.bind(instance),
      register: instance.register.bind(instance),
    };
  }

  private channelName: string;
  private connectionName: string;
  private readonly providers: Provider[];

  protected constructor() {
    this.providers = [
      RabbitManager,
    ];
  }

  public declareChannel(name: string, mode: ChannelMode): this {
    this.channelName = name;

    this.providers.push(createChannelProvider(name, mode));
    this.providers.push(createNativeChannelProvider(this.connectionName, name, mode));

    return this;
  }

  public declareConnection(name: string, options: ConnectionOptions | ConnectionOptionsProvider = {}): ConnectionConfigurator<this> {
    this.connectionName = name;

    if (isClassProvider(options) || isExistingProvider(options) || isFactoryProvider(options)) {
      this.providers.push(createConnectionOptionsProvider(name, options));
    } else {
      this.providers.push(createConnectionOptionsProvider(name, { useFactory: () => options as ConnectionOptions }));
    }

    this.providers.push(createConnectionProvider(name));
    this.providers.push(createNativeConnectionProvider(name));

    return {
      declareChannel: this.declareChannel.bind(this),
      register: this.register.bind(this),
    };
  }

  public declareExchange(name: string, type: ExchangeType, options: ExchangeOptions | ExchangeOptionsProvider = {}): this {
    if (isClassProvider(options) || isExistingProvider(options) || isFactoryProvider(options)) {
      this.providers.push(createExchangeOptionsProvider(name, options));
    } else {
      this.providers.push(createExchangeOptionsProvider(name, { useFactory: () => options as ExchangeOptions }));
    }

    this.providers.push(createExchangeProvider(this.channelName, name, type));

    return this;
  }

  public declareExchangeBinding(exchangeName: string, sourceName: string, options: ExchangeBindingOptions | ExchangeBindingOptionsProvider): this {
    if (isClassProvider(options) || isExistingProvider(options) || isFactoryProvider(options)) {
      this.providers.push(createExchangeBindingOptionsProvider(exchangeName, sourceName, options));
    } else {
      this.providers.push(createExchangeBindingOptionsProvider(exchangeName, sourceName, { useFactory: () => options as ExchangeBindingOptions }));
    }

    if (this.providers.some(it => getProviderName(it) === getExchangeBindingToken(exchangeName)) === false) {
      this.providers.push(createExchangeBindingProvider(exchangeName, sourceName));
    }

    return this;
  }

  public declareQueue(name: string, options: QueueOptions | QueueOptionsProvider = {}): this {
    if (isClassProvider(options) || isExistingProvider(options) || isFactoryProvider(options)) {
      this.providers.push(createQueueOptionsProvider(name, options));
    } else {
      this.providers.push(createQueueOptionsProvider(name, { useFactory: () => options as QueueOptions }));
    }

    this.providers.push(createQueueProvider(this.channelName, name));

    return this;
  }

  public declareQueueBinding(queueName: string, sourceName: string, options: QueueBindingOptions | QueueBindingOptionsProvider): this {
    if (isClassProvider(options) || isExistingProvider(options) || isFactoryProvider(options)) {
      this.providers.push(createQueueBindingOptionsProvider(queueName, sourceName, options));
    } else {
      this.providers.push(createQueueBindingOptionsProvider(queueName, sourceName, { useFactory: () => options as QueueBindingOptions }));
    }

    if (this.providers.some(it => getProviderName(it) === getQueueBindingToken(queueName)) === false) {
      this.providers.push(createQueueBindingProvider(queueName, sourceName));
    }

    return this;
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}

export interface ConnectionConfigurator<T> {
  declareChannel(name: string, mode: ChannelMode): T;
  register(): Package;
}

export interface InitialConfigurator<T> {
  declareConnection(name: string, options?: ConnectionOptions | ConnectionOptionsProvider): ConnectionConfigurator<T>;
  register(): Package;
}
