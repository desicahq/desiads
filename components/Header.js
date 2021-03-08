export default function Header() {
    return (
        <header className="h-screen flex flex-col justify-content-center items-center">
            <div className="m-auto">
            <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Desiads
          </h1>
          <p className="text-xl text-accents-6 sm:text-center sm:text-2xl max-w-2xl mt-5">
            Privacy respecting ads shouldn't break the bank
          </p>
            </div>
        </header>
    )
}