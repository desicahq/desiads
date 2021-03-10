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
          <br />
          <br />
          <form className="relative text-gray-700" action="https://mail.desica.uk/subscription/form">
          <input name="email" className="w-full h-16 pl-3 text-base placeholder-gray-600 rounded-lg focus:shadow-outline focus:outline-none pr-28 bg-gray-900" type="email" placeholder="Join the waitlist"/>
          <button className="m-1 absolute inset-y-0 right-0 flex items-center px-4 font-bold text-white bg-pink-600 rounded-md hover:bg-pink-500 focus:bg-pink-700 focus:outline-none" type="submit" value="Join now">Join now</button>
          <input id="d711c" type="checkbox" name="l" value="d711c01e-83f3-4657-8a2b-fb33dfd9c208" className="hidden" checked />
        </form>
            </div>
            <Wave />
        </header>
        <div className="bg-white">
          <p className="pt-24 text-xs uppercase text-accents-2 text-center font-bold tracking-widest">
            Partners
          </p>
          <div className="flex flex-col items-center py-8 space-y-4 sm:pt-8 sm:space-y-0 md:mx-auto md:max-w-2xl sm:grid sm:gap-6 sm:grid-cols-1">
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