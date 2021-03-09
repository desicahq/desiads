import Wave from "./Wave";

export default function Header() {
    return (
        <>
        <header className="h-screen flex flex-col justify-content-center items-center">
            <div className="m-auto px-5">
            <h1 className="text-4xl font-extrabold text-white text-center sm:text-6xl">
            Desiads
          </h1>
          <p className="text-xl text-accents-6 text-center sm:text-2xl max-w-2xl mt-5">
            Privacy respecting ads shouldn't break the bank
          </p>
            </div>
            <Wave />
        </header>
        <div>
          <p className="mt-24 text-xs uppercase text-accents-3 text-center font-bold tracking-widest">
            Partners
          </p>
          <div className="flex flex-col items-center my-8 space-y-4 sm:mt-8 sm:space-y-0 md:mx-auto md:max-w-2xl sm:grid sm:gap-6 sm:grid-cols-1">
          <div className="flex items-center justify-center">
              <a href="https://desica.uk" aria-label="desica.uk Link" className="flex">
                <img src="https://static.desica.uk/hotlink-ok/Badge.svg" className="h-12 text-primary"></img>
              </a>
            </div>
          </div>
        </div>  
        </>
    )
}