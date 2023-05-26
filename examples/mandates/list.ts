/**
 * @docs https://docs.mollie.com/reference/v2/mandates-api/list-mandates
 */
import createMollieClient, { List, Mandate } from '@mollie/api-client';

const mollieClient = createMollieClient({ apiKey: 'test_dHar4XY7LxsDOtmnkVtjNVWXLSlXsM' });

(async () => {
  try {
    const mandates: List<Mandate> = await mollieClient.customerMandates.page({
      customerId: 'cst_pzhEvnttJ2',
    });

    console.log(mandates);
  } catch (error) {
    console.warn(error);
  }
})();
