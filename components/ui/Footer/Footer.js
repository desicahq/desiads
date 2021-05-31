import Link from 'next/link';
import useSWR from 'swr'

import Logo from '../../icons/Logo';

function Status () {
  const fetcher = (args) => fetch(args).then(res => res.json())

  const { data, error } = useSWR('https://status.desica.uk/index.json', fetcher)

  if (error) return <div className="flex rounded-md border border-accents-2 p-2 px-3"><p className="mr-1">Status:</p><p className="text-red"><b>⟳</b> Failed to load status</p></div>
  if (!data) return <div className="flex rounded-md border border-accents-2 p-2 px-3"><p className="mr-1">Status:</p><p className="text-amber"><b>⟳</b> Loading system status</p></div>
  if (data.summaryStatus === "ok") return <div className="flex rounded-md border border-accents-2 p-2 px-3"><p className="mr-1">Status:</p><p className="text-blue"><small>⬤</small> All systems normal</p></div>
  if (data.summaryStatus === "disrupted") return <div className="flex rounded-md border border-accents-2 p-2 px-3"><p className="mr-1">Status:</p><p className="text-amber"><small>⬤</small> Partially disrupted</p></div>
  if (data.summaryStatus === "down") return <div className="flex rounded-md border border-accents-2 p-2 px-3"><p className="mr-1">Status:</p><p className="text-amber"><small>⬤</small> Some systems down</p></div>

  return <div className="flex rounded-md border border-accents-2 p-2 px-3"><p className="mr-1">Status:</p><p className="text-red"><b>⟳</b> Failed to load status</p></div>
}

export default function Footer() {
  return (
    <footer className="bg-primary-2">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-accents-2 py-12 text-primary transition-colors duration-150 bg-primary-2">
        <div className="col-span-1 lg:col-span-2">
          <Link href="/">
            <a className="flex flex-initial items-center font-bold md:mr-24">
              <span className="rounded-full mr-2">
                <Logo />
              </span>
              <span>Desica</span>
            </a>
          </Link>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-initial flex-col md:flex-1">
          <li className="py-3 md:py-0 md:pb-4">
              <p className="text-primary font-bold hover:text-accents-6 transition ease-in-out duration-150">
                PRODUCTS
              </p>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link href="https://desica.uk">
                <a className="text-primary hover:text-accents-6 transition ease-in-out duration-150">
                  Desica
                </a>
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link href="https://ads.desica.uk/">
                <a className="text-primary hover:text-accents-6 transition ease-in-out duration-150">
                  Desiads
                </a>
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link href="https://beta.kit.desica.uk/">
                <a className="text-primary hover:text-accents-6 transition ease-in-out duration-150">
                  Desikit
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-initial flex-col md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <p className="text-primary font-bold hover:text-accents-6 transition ease-in-out duration-150">
                LEGAL
              </p>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link href="https://policies.desica.uk/privacy">
                <a className="text-primary hover:text-accents-6 transition ease-in-out duration-150">
                  Privacy Policy
                </a>
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link href="https://policies.desica.uk/terms">
                <a className="text-primary hover:text-accents-6 transition ease-in-out duration-150">
                  Terms of Use
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center space-y-4 bg-primary-2">
        <div className="mb-6 sm:mb-6 md:mb-0 lg:md-0 xl:md-0 2xl:md-0">
          <span>&copy; 2021 Desica, LLC. All rights reserved.</span>
        </div>
        <div className="flex items-center" id="mt-0">
          <a rel="noreferrer" href="https://status.desica.uk" aria-label="status.desica.uk Link" target="_blank" className="focus:outline-none focus:ring-0">
            <Status />
          </a>
        </div>
      </div>
    </footer>
  );
}