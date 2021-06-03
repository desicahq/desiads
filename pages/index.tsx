import Pricing from '../components/Pricing';
import Header from '../components/Header'
import { getActiveProductsWithPrices } from '../utils/supabase-client';
import cn from 'classnames';

export default function PricingPage({ products }) {
  return (
    <>
      <Header />
      {/* <Pricing products={products} />*/}
    </>
  );
}

export async function getStaticProps() {
  const products = await getActiveProductsWithPrices();

  return {
    props: {
      products
    },
    revalidate: 60
  };
}
