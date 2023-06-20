import TransformingNetworkClient from '../../../communication/TransformingNetworkClient';
import Page from '../../../data/page/Page';
import { PaymentData } from '../../../data/payments/data';
import Payment from '../../../data/payments/Payment';
import ApiError from '../../../errors/ApiError';
import checkId from '../../../plumbing/checkId';
import renege from '../../../plumbing/renege';
import Callback from '../../../types/Callback';
import Binder from '../../Binder';
import { CreateParameters, IterateParameters, PageParameters } from './parameters';

function getPathSegments(customerId: string) {
  return `customers/${customerId}/payments`;
}

export default class CustomerPaymentsBinder extends Binder<PaymentData, Payment> {
  constructor(protected readonly networkClient: TransformingNetworkClient) {
    super();
  }

  /**
   * Creates a payment for the customer.
   *
   * Linking customers to payments enables a number of [Mollie Checkout](https://www.mollie.com/products/checkout) features, including:
   *
   * -   Keeping track of payment preferences for your customers.
   * -   Enabling your customers to charge a previously used credit card with a single click.
   * -   Improved payment insights in your dashboard.
   * -   Recurring payments.
   *
   * @since 1.1.1
   * @see https://docs.mollie.com/reference/v2/customers-api/create-customer-payment
   */
  public create(parameters: CreateParameters): Promise<Payment>;
  public create(parameters: CreateParameters, callback: Callback<Payment>): void;
  public create(parameters: CreateParameters) {
    if (renege(this, this.create, ...arguments)) return;
    const { customerId, ...data } = parameters;
    if (!checkId(customerId, 'customer')) {
      throw new ApiError('The customer id is invalid');
    }
    return this.networkClient.post<PaymentData, Payment>(getPathSegments(customerId), data);
  }

  /**
   * Retrieve all Payments linked to the Customer.
   *
   * @since 3.0.0
   * @see https://docs.mollie.com/reference/v2/customers-api/list-customer-payments
   */
  public page(parameters: PageParameters): Promise<Page<Payment>>;
  public page(parameters: PageParameters, callback: Callback<Page<Payment>>): void;
  public page(parameters: PageParameters) {
    if (renege(this, this.page, ...arguments)) return;
    const { customerId, ...query } = parameters;
    if (!checkId(customerId, 'customer')) {
      throw new ApiError('The customer id is invalid');
    }
    return this.networkClient.page<PaymentData, Payment>(getPathSegments(customerId), 'payments', query).then(result => this.injectPaginationHelpers(result, this.page, parameters));
  }

  /**
   * Retrieve all Payments linked to the Customer.
   *
   * @since 3.6.0
   * @see https://docs.mollie.com/reference/v2/customers-api/list-customer-payments
   */
  public iterate(parameters: IterateParameters) {
    const { customerId, valuesPerMinute, ...query } = parameters;
    if (!checkId(customerId, 'customer')) {
      throw new ApiError('The customer id is invalid');
    }
    return this.networkClient.iterate<PaymentData, Payment>(getPathSegments(customerId), 'payments', query, valuesPerMinute);
  }
}
