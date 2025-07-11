import { WidgetFactory, WidgetRepository } from '../../domain/repositories/WidgetRepository';
import { CreateWidgetUseCase, GetWidgetEmbedUrlUseCase, ListAvailableWidgetsUseCase, LoadWidgetFromUrlUseCase, UpdateWidgetUseCase } from '../../domain/use-cases/ManageWidget';
import { WidgetFactoryImpl } from '../repositories/WidgetFactoryImpl';
import { WidgetRepositoryImpl } from '../repositories/WidgetRepositoryImpl';

// Dependency Injection Container - Singleton pattern
export class DIContainer {
  private static instance: DIContainer;

  // Repositories
  private _widgetRepository: WidgetRepository;
  private _widgetFactory: WidgetFactory;

  // Use Cases
  private _createWidgetUseCase: CreateWidgetUseCase;
  private _updateWidgetUseCase: UpdateWidgetUseCase;
  private _getWidgetEmbedUrlUseCase: GetWidgetEmbedUrlUseCase;
  private _loadWidgetFromUrlUseCase: LoadWidgetFromUrlUseCase;
  private _listAvailableWidgetsUseCase: ListAvailableWidgetsUseCase;

  private constructor() {
    // Initialize repositories
    this._widgetRepository = new WidgetRepositoryImpl();
    this._widgetFactory = new WidgetFactoryImpl();

    // Initialize use cases with dependencies
    this._createWidgetUseCase = new CreateWidgetUseCase(this._widgetRepository, this._widgetFactory);
    this._updateWidgetUseCase = new UpdateWidgetUseCase(this._widgetRepository);
    this._getWidgetEmbedUrlUseCase = new GetWidgetEmbedUrlUseCase(this._widgetRepository);
    this._loadWidgetFromUrlUseCase = new LoadWidgetFromUrlUseCase(this._widgetRepository);
    this._listAvailableWidgetsUseCase = new ListAvailableWidgetsUseCase(this._widgetFactory);
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  // Repository getters
  get widgetRepository(): WidgetRepository {
    return this._widgetRepository;
  }

  get widgetFactory(): WidgetFactory {
    return this._widgetFactory;
  }

  // Use case getters
  get createWidgetUseCase(): CreateWidgetUseCase {
    return this._createWidgetUseCase;
  }

  get updateWidgetUseCase(): UpdateWidgetUseCase {
    return this._updateWidgetUseCase;
  }

  get getWidgetEmbedUrlUseCase(): GetWidgetEmbedUrlUseCase {
    return this._getWidgetEmbedUrlUseCase;
  }

  get loadWidgetFromUrlUseCase(): LoadWidgetFromUrlUseCase {
    return this._loadWidgetFromUrlUseCase;
  }

  get listAvailableWidgetsUseCase(): ListAvailableWidgetsUseCase {
    return this._listAvailableWidgetsUseCase;
  }
} 